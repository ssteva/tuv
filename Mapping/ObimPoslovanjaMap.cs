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
  public class ObimPoslovanjaMap : EntitetMap<ObimPoslovanja>
  {
    public ObimPoslovanjaMap()
    {
         base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tObimPoslovanja");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Sifra).CustomSqlType("nvarchar(10)");
      Map(x => x.Naziv);
      Map(x => x.Oznaka).CustomSqlType("nvarchar(10)");
      References(x => x.Primarna).Not.Update();
      References(x => x.Sekundarna).Not.Update();
      References(x => x.Tercijarna).Not.Update();
    }
  }
}
