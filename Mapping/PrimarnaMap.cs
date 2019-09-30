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
  public class PrimarnaMap : EntitetMap<Primarna>
  {
    public PrimarnaMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tPrimarna");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Sifra).CustomSqlType("nvarchar(10)");
      Map(x => x.Naziv);

    }
  }
}
