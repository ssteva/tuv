using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class Uplata : Entitet
  {
    public Uplata()
    {

    }
    public virtual int Id { get; set; }
    public virtual int Rbr { get; set; }
    public virtual string Broj { get; set; }
    public virtual DateTime Datum { get; set; }
    public virtual string Valuta { get; set; }
    public virtual decimal Kurs { get; set; }
    //public virtual int Kn { get; set; }
    public virtual decimal Iznos { get; set; }
    public virtual RadniNalog RadniNalog { get; set; }
    //public virtual ICollection<KlijentKontakt> Kontakti { get; set; }
  }
}


