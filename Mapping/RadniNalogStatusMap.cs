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
  public class RadniNalogStatusMap : EntitetMap<RadniNalogStatus>
  { 
    public RadniNalogStatusMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tRadniNalogStatus");
      Id(x => x.Id).GeneratedBy.Assigned();
      Map(x => x.Status).CustomSqlType("nvarchar(500)").Not.Update().Not.Insert();
      Map(x => x.Klasa).CustomSqlType("nvarchar(50)").Not.Update().Not.Insert();
    }
  }
}
