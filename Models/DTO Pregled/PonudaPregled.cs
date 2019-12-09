using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class PonudaPregled
  {

    public int Id { get; set; }
    public int? Rbr { get; set; }
    public string Broj { get; set; }
    public string Valuta { get; set; }
    public DateTime DatumPonude { get; set; }
    public DateTime DatumVazenja { get; set; }
    public decimal Vrednost { get; set; }
    public decimal VrednostSvedenoEur { get; set; }
    public  Klijent Klijent { get; set; }
    public string KlijentNaziv { get; set; }
    public PonudaStatus PonudaStatus { get; set; }
    //public virtual bool? OdobrenaR { get; set; }
    //public virtual bool? OdobrenaD { get; set; }
    public virtual bool? Prihvacena { get; set; }
    //public virtual string Vazenje { get; set; }
    public int Status { get; set; } //0 izrada, 1 prva potvrda, 2 odobrena  3 prihvacena ponuda
    public ICollection<PonudaPredmet> PredmetPonude { get; set; }
    public ObimPoslovanja Obim { get; set; }
    //public virtual decimal Vrednost { get; set; }
    //public virtual Klijent Klijent { get; set; }
    //public virtual Korisnik ZaduzenZaPonudu { get; set; }
    //public virtual ICollection<PonudaPredmet> PredmetPonude { get; set; }
  }
}


