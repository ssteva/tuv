using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tuv.Models.DTO
{
  public class Pivot
  {
    public int Id { get; set; }
    public int Godina { get; set; }
    public string Mesec { get; set; }
    public int Kn { get; set; }
    public DateTime Datum { get; set; }
    public string Klijent { get; set; }
    public string ZaduzenZaPonudu { get; set; }
    public decimal VrednostPonudeRsd { get; set; }
    public decimal VrednostPonudeEur { get; set; }
    public decimal FakturaRsd { get; set; }
    public decimal FakturaEur { get; set; }
    public decimal UplataRsd { get; set; }
    public decimal UplataEur { get; set; }
    public decimal VrednostPonudeSvedenoEur { get; set; }
  }
}
//datum: { type: 'date' },
//                    godina: { type: 'number' },
//                    mesec: { type: 'number' },
//                    kn: { type: 'number' },
//                    klijent: { type: 'string' },
//                    valuta: { type: 'string' },
//                    ponudaVrednostEur: { type: 'number' },
//                    ponudaVrednostRsd: { type: 'number' }
