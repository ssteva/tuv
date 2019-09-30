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
  public class ZapisMap : EntitetMap<Zapis>
  {
    public ZapisMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tZapis");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Rbr);
      Map(x => x.Datum).CustomSqlType("date");
      Map(x => x.Broj).CustomSqlType("nvarchar(30)");
      Map(x => x.Vrsta).CustomSqlType("nvarchar(50)");
      Map(x => x.Oznaka).CustomSqlType("nvarchar(1)");
      Map(x => x.FileName).CustomSqlType("nvarchar(200)");
      Map(x => x.Opis).CustomSqlType("nvarchar(2000)");
      Map(x => x.Odobreno);
      Map(x => x.DatumOdobrenja);
      Map(x => x.Size);
      Map(x => x.DateLastModified);
      References(x => x.RadniNalog).Cascade.None();
      References(x => x.Odobrio).Column("OdobrioId").Cascade.None();
      Map(x => x.RowId).Not.Nullable().CustomSqlType("uniqueidentifier ROWGUIDCOL").Default("newid()");
      Map(x => x.Data).CustomSqlType("VARBINARY(MAX)").Length(2147483647);
    }
  }
}
