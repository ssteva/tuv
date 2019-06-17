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
  public class PonudaMap : EntitetMap<Ponuda>
  { 
    public PonudaMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tPonuda");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Rbr);
      Map(x => x.Broj).CustomSqlType("nvarchar(50)");
      Map(x => x.DatumPonude).CustomSqlType("date");
      Map(x => x.DatumVazenja).CustomSqlType("date");
      Map(x => x.DatumOdobrenjaR).CustomSqlType("datetime");
      Map(x => x.DatumOdobrenjaD).CustomSqlType("datetime");
      Map(x => x.DatumPrihvatanja).CustomSqlType("datetime");
      Map(x => x.OdobrenaR);
      Map(x => x.OdobrenaD);
      Map(x => x.Prihvacena);
      Map(x => x.Vazenje).CustomSqlType("nvarchar(10)");
      Map(x => x.Vazi);
      Map(x => x.Valuta).CustomSqlType("nvarchar(3)");
      Map(x => x.Status);
      Map(x => x.Napomena).CustomSqlType("nvarchar(3000)");
      Map(x => x.Ostalo).CustomSqlType("nvarchar(3000)");
      Map(x => x.PrimenjiviZahtevi).CustomSqlType("nvarchar(2000)");
      Map(x => x.UsloviPlacanja).CustomSqlType("nvarchar(2000)");
      Map(x => x.Vrednost).Column("VrednostPonude").Not.Update().Not.Insert();
      References(x => x.Klijent).Cascade.None();
      References(x => x.ZaduzenZaPonudu).Column("ZaduzenZaPonuduId").Cascade.None();
      References(x => x.ZaduzenZaProjekat).Column("ZaduzenZaProjekatId").Cascade.None();
      HasMany(x => x.Stavke)
           .Inverse()
           .AsSet()
           .Cascade.All();
      HasMany(x => x.PredmetPonude)
           .Inverse()
           .AsSet()
           .Cascade.All();
      HasMany(x => x.Wfs)
           .Inverse()
           .AsSet()
           .Cascade.All();
    }
  }
}
