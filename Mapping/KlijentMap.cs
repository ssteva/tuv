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
  public class KlijentMap : EntitetMap<Klijent>
  {
    public KlijentMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tKlijent");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Rbr);
      Map(x => x.Naziv);
      Map(x => x.Drzava);
      Map(x => x.Mesto);
      Map(x => x.Adresa);
      Map(x => x.Pib);
      Map(x => x.VrednostRsd).Not.Update().Not.Insert();
      Map(x => x.VrednostEur).Not.Update().Not.Insert();
      Map(x => x.Komentar).CustomSqlType("nvarchar(1000)");
      HasMany(x => x.Kontakti)
        .Inverse()
        .AsSet()
        .Cascade.None();
    }
  }
}
