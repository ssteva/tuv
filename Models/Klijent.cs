using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class Klijent : Entitet
  {
    public Klijent()
    {
      Kontakti = new HashSet<KlijentKontakt>();
    }
    public virtual int Id { get; set; }
    public virtual int Rbr { get; set; }
    public virtual string Naziv { get; set; }
    public virtual string Drzava { get; set; }
    public virtual string Mesto { get; set; }
    public virtual string Adresa { get; set; }
    public virtual string Pib { get; set; }
    public virtual string Komentar { get; set; }
    public virtual decimal Ugovoreno { get; set; }
    public virtual decimal Uplaceno { get; set; }
    public virtual decimal Fakturisano { get; set; }
    public virtual ICollection<KlijentKontakt> Kontakti { get; set; }
  }
}


