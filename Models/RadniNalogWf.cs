using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class RadniNalogWf : Entitet
  {
    public RadniNalogWf()
    {
      Id = 0;
    }
    public virtual int Id { get; set; }
    public virtual RadniNalog RadniNalog { get; set; }
    public virtual DateTime Datum { get; set; }
    public virtual int Ishod { get; set; }
    public virtual string Tip { get; set; }
    public virtual string Opis { get; set; }
    public virtual string Komentar { get; set; }
    public virtual string TimelineIkona { get; set; }
    public virtual string Ikona { get; set; }
    public virtual Korisnik Korisnik { get; set; }
  }
}



