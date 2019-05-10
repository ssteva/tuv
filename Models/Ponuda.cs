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
      KorisniciProjekat = new HashSet<Korisnik>();
    }
    public virtual int Id { get; set; }
    public virtual int Rbr { get; set; }
    public virtual DateTime DatumPonude { get; set; }
    public virtual Klijent Klijent { get; set; }
    public virtual Korisnik PonuduKreirao { get; set; }
    public virtual Korisnik PonuduOdobrio { get; set; }
    public virtual Korisnik ZaduzenZaProjekat { get; set; }
    public virtual ICollection<Korisnik> KorisniciProjekat { get; set; }

  }
}


