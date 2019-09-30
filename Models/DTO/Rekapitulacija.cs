using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tuv.Models.DTO
{
  public class Rekapitulacija
  {
    public int Id { get; set; }
    public decimal PonudaR { get; set; }
    public decimal PonudaE { get; set; }
    public decimal PonudaU { get; set; }
    public decimal PponudaR { get; set; }
    public decimal PponudaE { get; set; }
    public decimal PponudaU { get; set; }
    public decimal FakturaR { get; set; }
    public decimal FakturaE { get; set; }
    public decimal FakturaU { get; set; }
    public decimal UplataR { get; set; }
    public decimal UplataE { get; set; }
    public decimal UplataU { get; set; }
    public decimal TrosakR { get; set; }
    public decimal TrosakE { get; set; }
    public decimal TrosakU { get; set; }
    public decimal ProcFakturisanoR { get; set; }
    public decimal ProcFakturisanoE { get; set; }
    public decimal ProcFakturisanoU { get; set; }
    public decimal ProcUplacenoR { get; set; }
    public decimal ProcUplacenoE { get; set; }
    public decimal ProcUplacenoU { get; set; }
  }
}
