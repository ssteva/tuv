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
using Newtonsoft.Json;

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
      _logger = loggerFactory.CreateLogger<ObimPoslovanjaController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Default(string tip)
    {
      try
      {
        object rez = null;
        if (tip == "Primarna")
          rez = new Primarna();
        if (tip == "Sekundarna")
          rez = new Sekundarna();
        if (tip == "Tercijarna")
          rez = new Tercijarna();
        if (tip == "Obim")
          rez = new ObimPoslovanja();

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
    public ActionResult Post([System.Web.Http.FromUri] string tip, [FromBody] JObject objekat)
    {
      object obj = null;
      try
      {
        
        if (tip == "Primarna")
        {
          obj = JsonConvert.DeserializeObject<Primarna>(objekat.ToString());
          _session.SaveOrUpdate(obj);
          _session.Flush();
          //var upit = _session.QueryOver<Primarna>().Where(x => !x.Obrisan);
          //var rez = upit.List<Primarna>();
          //return Json(new { Success = true, Message = "", Obj = rez });
        }
        if (tip == "Sekundarna")
        {
          obj = JsonConvert.DeserializeObject<Sekundarna>(objekat.ToString());
          _session.SaveOrUpdate(obj);
          _session.Flush();
          //var upit = _session.QueryOver<Sekundarna>().Where(x => !x.Obrisan);
          //var rez = upit.List<Sekundarna>();
          //return Json(new { Success = true, Message = "", Obj = rez });
        }
        if (tip == "Tercijarna")
        {
          obj = JsonConvert.DeserializeObject<Tercijarna>(objekat.ToString());
          _session.SaveOrUpdate(obj);
          _session.Flush();
          //var upit = _session.QueryOver<Tercijarna>().Where(x => !x.Obrisan);
          //var rez = upit.List<Tercijarna>();
          //return Json(new { Success = true, Message = "", Obj = rez });
        }
        if (tip == "Obim")
        {
          obj = JsonConvert.DeserializeObject<ObimPoslovanja>(objekat.ToString());
          _session.SaveOrUpdate(obj);
          _session.Flush();
          //var upit = _session.QueryOver<ObimPoslovanja>().Where(x => !x.Obrisan);
          //var rez = upit.List<ObimPoslovanja>();
          //return Json(new { Success = true, Message = "", Obj = rez });
        }
        return Json(new { Success = true, Message = "", Obj = objekat });

      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }

      
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Obrisi(string tip, int id)
    {
      try
      {

        var sql = _session.CreateSQLQuery("exec BrisiObim :tip, :id");
        sql.SetParameter("tip", tip, NHibernateUtil.String);
        sql.SetParameter("id", id, NHibernateUtil.Int32);
        sql.ExecuteUpdate();
        return Json(new { Success = true, Message = "" });

        //if (tip == "Primarna")
        //{
        //  var upit = _session.QueryOver<Primarna>()
        //    .Where(x => !x.Obrisan);
        //  var rez = upit.List<Primarna>();
        //  return Json(new { Success = true, Message = "", Obj = rez });
        //}
        //if (tip == "Sekundarna")
        //{
        //  var upit = _session.QueryOver<Sekundarna>()
        //    .Where(x => !x.Obrisan);
        //  var rez = upit.List<Sekundarna>();
        //  return Json(new { Success = true, Message = "", Obj = rez });
        //}
        //if (tip == "Tercijarna")
        //{
        //  var upit = _session.QueryOver<Tercijarna>()
        //    .Where(x => !x.Obrisan);
        //  var rez = upit.List<Tercijarna>();
        //  return Json(new { Success = true, Message = "", Obj = rez });
        //}
        //if (tip == "Obim")
        //{
        //  var upit = _session.QueryOver<ObimPoslovanja>()
        //    .Where(x => !x.Obrisan);
        //  var rez = upit.List<ObimPoslovanja>();
        //  return Json(new { Success = true, Message = "", Obj = rez });
        //}

      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }

      
    }

  }

  
}

