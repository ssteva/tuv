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
      Id(x => x.Id).GeneratedBy.Identity();
      Map(x => x.Rbr);
      Map(x => x.Naziv);
      Map(x => x.Drzava);
      Map(x => x.Mesto);
      Map(x => x.Adresa);
      Map(x => x.Pib);
      HasMany(x => x.Kontakti)
        .Inverse()
        .AsSet()
        .Cascade.None();
    }
  }
}
