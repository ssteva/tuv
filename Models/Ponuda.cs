using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class Ponuda : Entitet
  {
    public Ponuda()
    {
      Id = 0;
      DatumPonude = DateTime.Now;
      PredmetPonude = new HashSet<PonudaPredmet>();
      Stavke = new HashSet<PonudaStavka>();
      Wfs = new HashSet<PonudaWf>();
    }
    public virtual int Id { get; set; }
    public virtual int Rbr { get; set; }
    public virtual string Broj { get; set; }
    public virtual DateTime DatumPonude { get; set; }
    public virtual DateTime DatumVazenja{ get; set; }
    public virtual DateTime? DatumOdobrenjaR { get; set; }
    public virtual DateTime? DatumOdobrenjaD { get; set; }
    public virtual DateTime? DatumPrihvatanja { get; set; }
    public virtual bool? OdobrenaR { get; set; }
    public virtual bool? OdobrenaD { get; set; }
    public virtual bool? Prihvacena { get; set; }
    public virtual string Vazenje { get; set; }
    public virtual int Vazi { get; set; }
    public virtual string Valuta { get; set; }
    public virtual string Napomena { get; set; }
    public virtual string Ostalo { get; set; }
    public virtual string UsloviPlacanja { get; set; }
    public virtual string PrimenjiviZahtevi { get; set; }
    public virtual int Status { get; set; } //0 izrada, 1 prva potvrda, 2 odobrena  3 prihvacena ponuda
    public virtual decimal Vrednost { get; set; }
    public virtual Klijent Klijent { get; set; }
    public virtual Korisnik ZaduzenZaPonudu { get; set; }
    public virtual Korisnik ZaduzenZaProjekat { get; set; }
    public virtual ICollection<PonudaPredmet> PredmetPonude { get; set; }
    public virtual ICollection<PonudaStavka> Stavke { get; set; }
    public virtual ICollection<PonudaWf> Wfs { get; set; }
    //public virtual decimal Vrednost
    //{
    //  get
    //  {
    //    try
    //    {
    //      decimal vred = 0;
    //      foreach (var stavka in Stavke)
    //      {
    //        vred += stavka.Vrednost;
    //      }
    //      return vred;
    //    }
    //    catch
    //    {
    //      return 0;
    //    }
    //  }
    //}
    public virtual bool PotrebnoOdobrenjeDirektora
    {
      get
      {
        try
        {
          decimal vred = 0;
          foreach (var stavka in Stavke)
          {
            vred += stavka.VrednostEur;
          }
          return vred >= 10000;
        }
        catch
        {
          return false;
        }
      }
    }
    //public virtual string PredmetiPonude
    //{
    //  get
    //  {
    //    try
    //    {
    //      return string.Join(",", PredmetiPonude);
    //    }
    //    catch
    //    {
    //      return "";
    //    }
    //  }
    //}
  }
}


