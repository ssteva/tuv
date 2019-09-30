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
  public class RadniNalogPredmetMap : EntitetMap<RadniNalogPredmet>
  { 
    public RadniNalogPredmetMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tRadniNalogPredmet");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      References(x => x.RadniNalog).Cascade.None();
      References(x => x.ObimPoslovanja).Cascade.None();
      
    }
  }
}
