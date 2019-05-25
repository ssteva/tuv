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
      Id(x => x.Id).GeneratedBy.Identity();
      Map(x => x.Rbr);
      Map(x => x.Broj).CustomSqlType("nvarchar(50)");
      Map(x => x.OpisPosla).CustomSqlType("nvarchar(1000)");
      Map(x => x.DatumPonude).CustomSqlType("date");
      Map(x => x.DatumPrihvatanja).CustomSqlType("date");
      Map(x => x.Prihvacena);
      Map(x => x.Valuta).CustomSqlType("nvarchar(3)");
      Map(x => x.Vrednost);
      Map(x => x.Komentar).CustomSqlType("nvarchar(1000)");

      References(x => x.Klijent).Cascade.None();
      References(x => x.ZaduzenZaPonudu).Column("ZaduzenZaPonuduId").Cascade.None();
      References(x => x.ZaduzenZaProjekat).Column("ZaduzenZaProjekatId").Cascade.None();
    }
  }
}
