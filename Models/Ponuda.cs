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
            DatumPonude = DateTime.Now;
            Id = 0;

        }
        public virtual int Id { get; set; }
        public virtual int Rbr { get; set; }
        public virtual string Broj { get; set; }
        public virtual string OpisPosla { get; set; }
        public virtual DateTime DatumPonude { get; set; }
        public virtual DateTime? DatumPrihvatanja { get; set; }
        public virtual bool? Prihvacena { get; set; }
        public virtual string Valuta { get; set; }
        public virtual decimal Vrednost { get; set; }
        public virtual string Komentar { get; set; }
        public virtual int Status { get; set; } //0 izrada, 1 prva potvrda, 2 prohvacena ponuda
        public virtual Klijent Klijent { get; set; }
        public virtual Korisnik ZaduzenZaPonudu { get; set; }
        public virtual Korisnik ZaduzenZaProjekat { get; set; }


    }
}


