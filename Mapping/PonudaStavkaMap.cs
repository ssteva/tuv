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
    public class PonudaStavkaMap : EntitetMap<PonudaStavka>
    {
        public PonudaStavkaMap()
        {
            base.MapSubClass();
        }
        protected override void MapSubClass()
        {
            Table("tPonudaStavka");
            Id(x => x.Id).GeneratedBy.Identity().UnsavedValue(0);
            Map(x => x.OpisPosla).CustomSqlType("nvarchar(2000)");

            Map(x => x.Jm).CustomSqlType("nvarchar(50)");
            Map(x => x.Kolicina).CustomSqlType("decimal(12,2)");
            Map(x => x.Kurs).CustomSqlType("decimal(8,2)");
            //Map(x => x.Kn);
            Map(x => x.PoreskaStopa);
            Map(x => x.Cena).CustomSqlType("decimal(18,2)");
            Map(x => x.Vrednost).Not.Update().Not.Insert();
            References(x => x.Ponuda).Cascade.None();


        }
    }
}
