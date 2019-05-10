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
  public class KursnaListaMap : EntitetMap<KursnaLista>
  {
    public KursnaListaMap()
    {
      base.MapSubClass();
    }
    protected override void MapSubClass()
    {
      Table("tKurnsaLista");
      Id(x => x.Id).GeneratedBy.Identity();
      Map(x => x.Godina);
      Map(x => x.Nedelja);
      Map(x => x.Valuta).CustomSqlType("nvarchar(3)");
      Map(x => x.Kurs).CustomSqlType("decimal(8,2)");

    }
  }
}
