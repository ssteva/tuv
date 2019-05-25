using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class Dokument : Entitet
  {
    public Dokument()
    {

    }
    public virtual int Id { get; set; }
    public virtual string Entitet { get; set; }
    public virtual string EntitetOpis { get; set; }
    public virtual string Opis { get; set; }
    public virtual int EntitetId { get; set; }
    public virtual string FileName { get; set; }
    public virtual DateTime DateLastModified { get; set; }
    public virtual long Size { get; set; }
    public virtual byte[] Data { get; set; }
    public virtual Guid RowId { get; set; }


  }
}


