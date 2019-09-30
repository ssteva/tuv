using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class Zapis : Entitet
  {
    public Zapis()
    {
    }
    public virtual int Id { get; set; }
    public virtual int Rbr { get; set; }
    public virtual string Opis   { get; set; }
    public virtual string Vrsta { get; set; }
    public virtual string Oznaka { get; set; }
    public virtual string Broj { get; set; }
    public virtual bool? Odobreno { get; set; }
    public virtual DateTime Datum { get; set; }
    public virtual DateTime? DatumOdobrenja { get; set; }
    public virtual RadniNalog RadniNalog { get; set; }
    public virtual Korisnik Odobrio { get; set; }
    public virtual string FileName { get; set; }
    public virtual DateTime DateLastModified { get; set; }
    
    public virtual long Size { get; set; }
    [JsonIgnore]
    public virtual byte[] Data { get; set; }
    public virtual Guid RowId { get; set; }

  }
}


