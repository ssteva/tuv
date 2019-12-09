using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class RadniNalog : Entitet
  {
    public RadniNalog()
    {
      Id = 0;
      //PredmetNaloga = new HashSet<RadniNalogPredmet>();
      Wfs = new HashSet<RadniNalogWf>();
      //Uplate = new HashSet<Uplata>();
      //Fakture = new HashSet<Faktura>();
    }
    public virtual int Id { get; set; }
    public virtual int Rbr { get; set; }
    public virtual string Broj { get; set; }
    public virtual string PredmetKontrolisanja { get; set; }
    public virtual string ProgramKontrolisanja { get; set; }
    public virtual string ReferentniStandard { get; set; }
    public virtual string MkoOprema { get; set; }
    public virtual string Napomena { get; set; }
    public virtual string Valuta { get; set; }
    public virtual int Status { get; set; }
    public virtual DateTime DatumKreiranja { get; set; }
    public virtual DateTime? DatumZatvaranja { get; set; }
    public virtual DateTime? OcekivaniRokZavrsetka { get; set; }
    public virtual decimal FakturisanoNalog { get; set; }
    public virtual decimal UplacenoNalog { get; set; }
    public virtual Ponuda Ponuda { get; set; }
    public virtual Korisnik ZaduzenZaRealizaciju { get; set; }
    public virtual RadniNalogStatus RadniNalogStatus { get; set; }
    public virtual ObimPoslovanja PredmetNaloga { get; set; }
    //public virtual Korisnik Kontrolisao { get; set; }
    //public virtual Korisnik PredmetZatvorio { get; set; }
    //public virtual ICollection<RadniNalogPredmet> PredmetNaloga { get; set; }
    public virtual ICollection<RadniNalogWf> Wfs { get; set; }
    public virtual bool Zatvoren { get; set; }
    //public virtual ICollection<Faktura> Fakture { get; set; }
    //public virtual ICollection<Uplata> Uplate { get; set; }
  }
}

//·        Broj ponude(da generiše iz ponude);

//·        Predmet ponude(da generiše iz ponude);

//·        Broj radnog naloga(da dodeli aplikacija sledeci) RN 001/19…;

//·        Naručilac usluge(da generiše iz ponude);

//·        Predmet kontrolisanja(slobodno polje, opis)....u slobodnom polju bi rukovodilac mogao da da opisno uputstvo ili da kratko napiše „prema ugovoru/ponudi“

//·        Program kontrolisanja(slobodno polje, opis);

//·        Referentni standard/ propis(slobodno polje, opis);

//·        MKO oprema(slobodno polje, opis);

//·        Očekivani rok završetka kontrolisanja;

//·        KRATAK OPIS / NAPOMENE(slobodno polje, opis);

//·        Zadužen za realizaciju;

