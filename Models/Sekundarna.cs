using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class Sekundarna : Entitet
  {
    public virtual int Id { get; set; }
    public virtual string Sifra { get; set; }
    public virtual string Naziv { get; set; }
    public virtual Primarna Primarna { get; set; }
    

  }
}


