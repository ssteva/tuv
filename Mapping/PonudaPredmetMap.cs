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
  public class PonudaPredmetMap : EntitetMap<PonudaPredmet>
  { 
    public PonudaPredmetMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tPonudaPredmet");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      References(x => x.Ponuda).Cascade.None();
      References(x => x.ObimPoslovanja).Cascade.None();
      
    }
  }
}
