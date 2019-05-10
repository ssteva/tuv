using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class KursnaLista : Entitet
  {
    public virtual int Id { get; set; }
    public virtual int Godina { get; set; }
    public virtual int Nedelja { get; set; }
    public virtual string Valuta { get; set; }
    public virtual decimal Kurs { get; set; }

  }
}


