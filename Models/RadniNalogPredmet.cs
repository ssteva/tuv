using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace Tuv.Models
{
  public class RadniNalogPredmet : Entitet
  {
    public RadniNalogPredmet()
    {
      Id = 0;
    }
    public virtual int Id { get; set; }
    public virtual RadniNalog RadniNalog { get; set; }
    public virtual ObimPoslovanja ObimPoslovanja { get; set; }
  }
}


