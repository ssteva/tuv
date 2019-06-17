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
  public class TercijarnaMap : EntitetMap<Tercijarna>
  {
    public TercijarnaMap()
    {
         base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tTercijarna");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Sifra);
      Map(x => x.Naziv);
      References(x => x.Primarna).Not.Update();
      References(x => x.Sekundarna).Not.Update();

    }
  }
}
