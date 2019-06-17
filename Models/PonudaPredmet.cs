using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class PonudaPredmet : Entitet
  {
    public PonudaPredmet()
    {
      Id = 0;
    }
    public virtual int Id { get; set; }
    public virtual Ponuda Ponuda { get; set; }
    public virtual ObimPoslovanja ObimPoslovanja { get; set; }
  }
}


