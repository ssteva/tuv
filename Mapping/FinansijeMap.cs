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
  public class FinansijeMap : EntitetMap<Finansije>
  {
    public FinansijeMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tFinansije");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Rbr);
      Map(x => x.Vrsta).CustomSqlType("nvarchar(1)");
      Map(x => x.Broj).CustomSqlType("nvarchar(50)");
      Map(x => x.Datum).CustomSqlType("date");
      Map(x => x.Valuta).CustomSqlType("nvarchar(3)");
      Map(x => x.Kurs).CustomSqlType("decimal(8,2)");
      Map(x => x.PoreskaStopa);
      //Map(x => x.Kn);
      Map(x => x.Iznos).CustomSqlType("decimal(18,2)");
      //Map(x => x.IznosRsd).CustomSqlType("decimal(18,2)");
      References(x => x.RadniNalog).Cascade.None();
    }
  }
}
