using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class KlijentKontakt : Entitet
  {
    public virtual int Id { get; set; }
    public virtual string Oblast { get; set; }
    public virtual string Ime { get; set; }
    public virtual string Email { get; set; }
    public virtual string Telefon { get; set; }
    public virtual Klijent Klijent { get; set; }
  }
}


