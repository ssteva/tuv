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
  public class PonudaWfMap : EntitetMap<PonudaWf>
  { 
    public PonudaWfMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tPonudaWf");
      Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
      Map(x => x.Datum).CustomSqlType("datetime").Default("getdate()");
      Map(x => x.Tip).CustomSqlType("nvarchar(50)");
      Map(x => x.Ishod);
      Map(x => x.IshodOpis).CustomSqlType("nvarchar(50)");
      Map(x => x.Opis).CustomSqlType("nvarchar(1000)");
      References(x => x.Ponuda).Cascade.None();
      References(x => x.Korisnik).Cascade.None();
      
    }
  }
}
