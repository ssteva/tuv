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
  public class DokumentMap : EntitetMap<Dokument>
  {
    public DokumentMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tDokument");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.RowId).Not.Nullable().CustomSqlType("uniqueidentifier ROWGUIDCOL").Default("newid()");
      Map(x => x.Entitet).CustomSqlType("nvarchar(50)");
      Map(x => x.EntitetOpis).CustomSqlType("nvarchar(50)");
      Map(x => x.Opis);
      Map(x => x.EntitetId);
      Map(x => x.FileName).CustomSqlType("nvarchar(100)");
      Map(x => x.Data).CustomSqlType("VARBINARY(MAX)").Length(2147483647);
      Map(x => x.Size);
      Map(x => x.DateLastModified);
    }
  }
}
