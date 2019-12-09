using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Tuv.Models;

namespace Tuv.Mapping
{
  public class RadniNalogMap : EntitetMap<RadniNalog>
  {
    public RadniNalogMap()
    {
      base.MapSubClass();
    }
    //public virtual int Id { get; set; }
    //public virtual string Opis { get; set; }
    //public DateTime DatumZatvaranja { get; set; }
    //public virtual Ponuda Ponuda { get; set; }
    //public virtual Korisnik ZaduzeniInspektor { get; set; }
    //public virtual Korisnik Kontrolisao { get; set; }
    //public virtual Korisnik PredmetZatvorio { get; set; }
    //public virtual ICollection<RadniNalogPredmet> VrstaUsloge { get; set; }
    //public virtual ICollection<RadniNalogWf> Wfs { get; set; }
    protected override void MapSubClass()
    {
      Table("tRadniNalog");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Rbr);
      Map(x => x.Broj).CustomSqlType("nvarchar(50)");
      Map(x => x.PredmetKontrolisanja).CustomSqlType("nvarchar(2000)");
      Map(x => x.ProgramKontrolisanja).CustomSqlType("nvarchar(2000)");
      Map(x => x.ReferentniStandard).CustomSqlType("nvarchar(2000)");
      Map(x => x.MkoOprema).CustomSqlType("nvarchar(2000)");
      Map(x => x.Napomena).CustomSqlType("nvarchar(2000)");
      Map(x => x.Status);
      Map(x => x.DatumKreiranja).CustomSqlType("date");
      Map(x => x.OcekivaniRokZavrsetka).CustomSqlType("date");
      Map(x => x.DatumZatvaranja).CustomSqlType("date");
      Map(x => x.Valuta).CustomSqlType("nvarchar(3)");
      Map(x => x.Zatvoren);
      Map(x => x.FakturisanoNalog).Not.Update().Not.Insert();
      Map(x => x.UplacenoNalog).Not.Update().Not.Insert();
      References(x => x.Ponuda).Cascade.None();
      References(x => x.RadniNalogStatus).Column("Status").Not.Update().Not.Insert().ForeignKey("FK_StatusNaloga");
      References(x => x.PredmetNaloga).Column("PredmetNalogaId").Cascade.None();
      References(x => x.ZaduzenZaRealizaciju).Column("ZaduzenZaRealizacijuId").Cascade.None();
      //References(x => x.PredmetZatvorio).Column("PredmetZatvorioId").Cascade.None();
      HasMany(x => x.Wfs)
           .Inverse()
           .AsSet()
           .Cascade.All();
      //HasMany(x => x.Fakture)
      //   .Inverse()
      //   .AsSet()
      //   .Cascade.All();
      //HasMany(x => x.Uplate)
      //   .Inverse()
      //   .AsSet()
      //   .Cascade.All();
      //HasMany(x => x.PredmetNaloga)
      //     .Inverse()
      //     .AsSet()
      //     .Cascade.All();
    }
  }
}
//public virtual int Rbr { get; set; }
//public virtual string Broj { get; set; }
//public virtual string PredmetKontrolisanja { get; set; }
//public virtual string ProgramKontrolisanja { get; set; }
//public virtual string ReferentniStandard { get; set; }
//public virtual string MkoOprema { get; set; }
//public virtual string Napomena { get; set; }
//public virtual DateTime DatumKreiranja { get; set; }
//public virtual DateTime DatumZatvaranja { get; set; }
//public virtual DateTime OcekivaniRokZavrsetka { get; set; }
//public virtual Ponuda Ponuda { get; set; }
//public virtual Korisnik ZaduzenZaRealizaciju { get; set; }
