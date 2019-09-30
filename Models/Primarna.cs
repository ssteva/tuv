using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class Primarna : Entitet
  {
    public virtual int Id { get; set; }
    public virtual string Sifra { get; set; }
    public virtual string Naziv { get; set; }

  }
}


