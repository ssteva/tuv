using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tuv.Models.Kendo
{
    public class KendoResult<T>
    {
        public IEnumerable<T>  Data { get; set; }
        public int Total { get; set; }
    }
}
