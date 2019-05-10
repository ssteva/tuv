using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuv.Models
{
    public class Konfiguracija 
    {
        public  int minutaToken { get; set; }
        public  int minutaRefreshToken { get; set; }
        public bool seed {get;set;}
        public bool rekreirajBazu {get;set;}
    }
}


