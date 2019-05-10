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

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Tuv.Controllers.api
{
  [Route("api/[controller]")]
  [Authorize("Bearer")]
  public class ObimPoslovanjaController : Controller
  {
    private readonly ILogger _logger;
    private readonly ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public ObimPoslovanjaController(ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<KorisnikController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Primarna()
    {
      try
      {
        var upit = _session.QueryOver<Primarna>()
          .Where(x => !x.Obrisan);
        var rez = upit.List<Primarna>();
        return Json(new { Success = true, Message = "", Obj = rez });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }
    [HttpGet]
    [Route("[Action]")]
    public ActionResult Sekundarna()
    {
      try
      {
        var upit = _session.QueryOver<Sekundarna>()
          .Where(x => !x.Obrisan);
        var rez = upit.List<Sekundarna>();
        return Json(new { Success = true, Message = "", Obj = rez });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }
    [HttpGet]
    [Route("[Action]")]
    public ActionResult Tercijarna()
    {
      try
      {
        var upit = _session.QueryOver<Tercijarna>()
          .Where(x => !x.Obrisan);
        var rez = upit.List<Tercijarna>();
        return Json(new { Success = true, Message = "", Obj = rez });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Obim()
    {
      try
      {
        var upit = _session.QueryOver<ObimPoslovanja>()
          .Where(x => !x.Obrisan);
        var rez = upit.List<ObimPoslovanja>();
        return Json(new { Success = true, Message = "", Obj = rez });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpPost]
    public ActionResult Post([FromBody] List<KursnaLista> lista)
    {
      try
      {

        foreach (var kn  in lista)
        {
          
          _session.SaveOrUpdate(kn);
        }

        _session.Flush();
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }

      return Json(new { Success = true, Message = "", Obj = lista });
    }

    [HttpGet]
    public ActionResult Obrisi(string tip, int id)
    {
      try
      {

        var sql = _session.CreateSQLQuery("exec BrisiOblast :tip, :id");
        sql.SetParameter("tip", tip, NHibernateUtil.String);
        sql.SetParameter("id", id, NHibernateUtil.Int32);
        sql.ExecuteUpdate();

        if (tip == "Primarna")
        {
          var upit = _session.QueryOver<Primarna>()
            .Where(x => !x.Obrisan);
          var rez = upit.List<Primarna>();
          return Json(new { Success = true, Message = "", Obj = rez });
        }
        if (tip == "Sekundarna")
        {
          var upit = _session.QueryOver<Sekundarna>()
            .Where(x => !x.Obrisan);
          var rez = upit.List<Sekundarna>();
          return Json(new { Success = true, Message = "", Obj = rez });
        }
        if (tip == "Tercijarna")
        {
          var upit = _session.QueryOver<Tercijarna>()
            .Where(x => !x.Obrisan);
          var rez = upit.List<Tercijarna>();
          return Json(new { Success = true, Message = "", Obj = rez });
        }
        if (tip == "Obim")
        {
          var upit = _session.QueryOver<ObimPoslovanja>()
            .Where(x => !x.Obrisan);
          var rez = upit.List<ObimPoslovanja>();
          return Json(new { Success = true, Message = "", Obj = rez });
        }

      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }

      return Json(new { Success = true, Message = "" });
    }

  }

  
}

