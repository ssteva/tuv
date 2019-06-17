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
  public class KlijentKontaktMap : EntitetMap<KlijentKontakt>
  {
    public KlijentKontaktMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tKlijentKontakt");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Oblast).CustomSqlType("nvarchar(50)");
      Map(x => x.Ime).CustomSqlType("nvarchar(50)");
      Map(x => x.Email).CustomSqlType("nvarchar(50)");
      Map(x => x.Telefon).CustomSqlType("nvarchar(50)");
      References(x => x.Klijent).Cascade.None().Not.Update();
    }
  }
}
