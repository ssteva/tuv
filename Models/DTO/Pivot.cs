using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tuv.Models.DTO
{
  public class Pivot
  {
    public int Idponuda { get; set; }
    public int Idnalog { get; set; }
    public long RowNumber { get; set; }
    public int Godina { get; set; }
    public string Mesec { get; set; }
    public int Kn { get; set; }
    public DateTime Datum { get; set; }
    public string Klijent { get; set; }
    public string Ponuda { get; set; }
    public string Nalog { get; set; }
    public string ZaduzenZaPonudu { get; set; }
    public int BrojPrihvacenihPonuda { get; set; }
    public decimal PonudaR { get; set; }
    public decimal PonudaE { get; set; }
    public decimal PonudaU { get; set; }
    public decimal PponudaR { get; set; }
    public decimal PponudaE { get; set; }
    public decimal PponudaU { get; set; }
    public decimal FakturaR { get; set; }
    public decimal FakturaE { get; set; }
    public decimal FakturaU { get; set; }
    public decimal UplataR { get; set; }
    public decimal UplataE { get; set; }
    public decimal UplataU { get; set; }
    public decimal TrosakR { get; set; }
    public decimal TrosakE { get; set; }
    public decimal TrosakU { get; set; }
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

