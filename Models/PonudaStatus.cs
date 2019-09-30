using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class PonudaStatus : Entitet
  {
    public PonudaStatus()
    {
      Id = 0;
    }
    public virtual int Id { get; set; }
    public virtual string Status { get; set; }
    public virtual string Klasa { get; set; }
  }
}



