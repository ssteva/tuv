﻿using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Tuv.Models
{
  public class KlijentPregled
  {

    public int Id { get; set; }
    public string Naziv { get; set; }
    public string Drzava { get; set; }
    public string Mesto { get; set; }
    public string Adresa { get; set; }
    public string Pib { get; set; }
    public string Komentar { get; set; }
    public decimal Ugovoreno { get; set; }
    public decimal Fakturisano { get; set; }
    public decimal Uplaceno { get; set; }
  }
}


