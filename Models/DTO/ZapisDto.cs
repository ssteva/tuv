using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tuv.Models;

namespace tuv.Models.DTO
{
  public class ZapisDto
  {
    public int Id { get; set; }
    public string Vrsta { get; set; }
    public string Oznaka { get; set; }
    public int Rbr { get; set; }
    public string Broj { get; set; }
    public bool? Odobreno { get; set; }
    public DateTime Datum { get; set; }
    public DateTime? DatumOdobrenja { get; set; }
    public string Opis { get; set; }
    public string FileName { get; set; }
    public DateTime DateLastModified { get; set; }
    public DateTime DateUploaded { get; set; }
    public long Size { get; set; }
    public RadniNalog RadniNalog { get; set; }
    public Ponuda Ponuda { get; set; }
    public Klijent Klijent { get; set; }

    public Korisnik Odobrio { get; set; }
  }
}

