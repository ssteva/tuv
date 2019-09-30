using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using NHibernate;
//using VoxServis.Services;
using ILoggerFactory = Microsoft.Extensions.Logging.ILoggerFactory;
//using ISession = NHibernate.ISession;
using System.Globalization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json.Linq;
using NHibernate.Criterion;
using Tuv.Models;
using Tuv.Helper;
using Tuv.Models.Kendo;
using Microsoft.AspNetCore.Http;
using tuv.Models.DTO;
using NHibernate.Transform;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Tuv.Controllers.api
{
  [Route("api/[controller]")]
  //[Authorize("Bearer")]
  public class IzvestajController : Controller
  {
    private readonly ILogger _logger;
    private readonly NHibernate.ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public IzvestajController(NHibernate.ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<IzvestajController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }


    [HttpPost]
    [Route("[Action]")]
    public ActionResult Datumi() //[Microsoft.AspNetCore.Mvc.FromBody] DatumiUlazniPodaci par
    {
      var query = _session.CreateSQLQuery("exec datumi");
      //query.SetParameter("period", par?.Period, NHibernateUtil.Int32);
      //query.SetParameter("zavrsen", par?.Zavrsen, NHibernateUtil.Boolean);
      query.SetResultTransformer(new AliasToBeanResultTransformer(typeof(DatumiIzlazniPodaci)));
      var res = query.List<DatumiIzlazniPodaci>();
      return Ok(res);
    }
    public class DatumiUlazniPodaci
    {
      public int? Period { get; set; }
      public bool? Zavrsen { get; set; }
    }
    public class DatumiIzlazniPodaci
    {
      public DateTime Dat1 { get; set; }
      public DateTime Dat2 { get; set; }
    }
    public class Parametri
    {
      public DateTime Dat1 { get; set; }
      public DateTime Dat2 { get; set; }

    }
    [HttpPost]
    [Route("[Action]")]
    public ActionResult Pivot([FromBody] Parametri par)
    {
      var query = _session.CreateSQLQuery("exec report :dat1, :dat2");
      query.SetParameter("dat1", par?.Dat1, NHibernateUtil.Date);
      query.SetParameter("dat2", par?.Dat2, NHibernateUtil.Date);
      query.SetResultTransformer(new AliasToBeanResultTransformer(typeof(Pivot)));
      var result = query.List<Pivot>();
      return Ok(result);
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Rekapitulacija(DateTime? dat1, DateTime? dat2, int klijentid, int ponudaid, int radninalogid)
    {
      var query = _session.CreateSQLQuery("exec rekapitulacija :dat1, :dat2, :klijentid, :ponudaid, :radninalogid");
      query.SetParameter("dat1", null, NHibernateUtil.Date);
      query.SetParameter("dat2", null, NHibernateUtil.Date);
      query.SetParameter("klijentid", null, NHibernateUtil.Int32);
      query.SetParameter("ponudaid", null, NHibernateUtil.Int32);
      query.SetParameter("radninalogid", null, NHibernateUtil.Int32);
      query.SetResultTransformer(new AliasToBeanResultTransformer(typeof(Rekapitulacija)));
      var result = query.UniqueResult<Rekapitulacija>();
      return Ok(result);
    }

  }
}

