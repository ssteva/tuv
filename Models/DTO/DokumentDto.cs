using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tuv.Models.DTO
{
  public class DokumentDto
  {
    public int Id { get; set; }
    public string Opis { get; set; }
    public  string FileName { get; set; }
    public  DateTime DateLastModified { get; set; }
    public DateTime DateUploaded { get; set; }
    public long Size { get; set; }
  }
}

