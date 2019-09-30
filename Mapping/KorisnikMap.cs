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
  public class KorisnikMap : EntitetMap<Korisnik>
  {
    public KorisnikMap()
    {
         base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tKorisnik");
      Id(x => x.Id).UnsavedValue(0).GeneratedBy.Identity().UnsavedValue(0);
      Map(x=>x.KorisnickoIme).Unique();
      Map(x=>x.Ime);
      Map(x=>x.Prezime);
      Map(x => x.Email);
      Map(x=>x.Lozinka).CustomSqlType("binary(64)");
      Map(x => x.So);
      Map(x=>x.Uloga);
      Map(x => x.Telefon);
      Map(x => x.Mobilni);
      Map(x=>x.Aktivan);
      Map(x => x.Lang).CustomSqlType("nvarchar(10)").Default("'sr'");

      //References(x => x.Meni).Cascade.None();
    }
  }
}
