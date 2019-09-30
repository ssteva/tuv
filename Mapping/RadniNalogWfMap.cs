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
  public class RadniNalogWfMap : EntitetMap<RadniNalogWf>
  { 
    public RadniNalogWfMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tRadniNalogWf");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Datum).CustomSqlType("datetime").Default("getdate()");
      Map(x => x.Tip).CustomSqlType("nvarchar(50)");
      Map(x => x.Opis).CustomSqlType("nvarchar(1000)");
      Map(x => x.Ishod);
      Map(x => x.Komentar).CustomSqlType("nvarchar(3000)");
      Map(x => x.TimelineIkona).CustomSqlType("nvarchar(50)");
      Map(x => x.Ikona).CustomSqlType("nvarchar(50)");
      References(x => x.RadniNalog).Cascade.None();
      References(x => x.Korisnik).Cascade.None();

    }
  }
}
