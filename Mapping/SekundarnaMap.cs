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
  public class SekundarnaMap : EntitetMap<Sekundarna>
  {
    public SekundarnaMap()
    {
         base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tSekundarna");
      Id(x => x.Id).GeneratedBy.Identity();
      Map(x => x.Sifra);
      Map(x => x.Naziv);
      References(x => x.Primarna).Cascade.All().Not.Update();

    }
  }
}
