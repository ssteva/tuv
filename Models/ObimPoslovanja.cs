using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class ObimPoslovanja : Entitet
  {
    public virtual int Id { get; set; }
    public virtual string Sifra { get; set; }
    public virtual string Naziv { get; set; }
    public virtual string Oznaka { get; set; }
    public virtual Primarna Primarna { get; set; }
    public virtual Sekundarna Sekundarna { get; set; }
    public virtual Tercijarna Tercijarna { get; set; }
    

  }
}


