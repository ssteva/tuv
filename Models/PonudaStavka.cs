using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class PonudaStavka : Entitet
  {
    public PonudaStavka()
    {
      Id = 0;
    }
    public virtual int Id { get; set; }
    public virtual Ponuda Ponuda { get; set; }


    public virtual string OpisPosla { get; set; }
    public virtual string Jm { get; set; }
    public virtual int Kolicina { get; set; }
    public virtual decimal Kurs { get; set; }
    public virtual decimal Cena { get; set; }
    public virtual decimal Vrednost { get; set; }
    //public virtual decimal Vrednost
    //{
    //  get
    //  {
    //    try
    //    {
    //      return Math.Round(Cena * Kolicina, 2);
    //    }
    //    catch
    //    {
    //      return 0;
    //    }
    //  }
    //}
    public virtual decimal VrednostEur
    {
      get
      {
        try
        {
          if (Ponuda.Valuta == "EUR") { return Vrednost; }
          else { return Vrednost / Kurs; };
        }
        catch
        {
          return 0;
        }
      }
    }

  }
}


