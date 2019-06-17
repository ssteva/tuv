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
  public class DokumentController : Controller
  {
    private readonly ILogger _logger;
    private readonly NHibernate.ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public DokumentController(NHibernate.ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<DokumentController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }


    [HttpGet("{id}")]
    [Route("[Action]")]
    public ActionResult Get(int id)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {
        var dokument = _session.Get<Dokument>(id);

        var ms = new MemoryStream(dokument.Data);
        ms.Seek(0, SeekOrigin.Begin);
        return File(ms, "application/octet-stream", dokument.FileName); // returns a FileStreamResult
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }


    [HttpGet]
    [Route("[Action]")]
    public ActionResult Lista(string entitet, string entitetopis, int entitetid)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {
        var docs = _session.QueryOver<Dokument>()
          .Where(x => !x.Obrisan)
          .And(x => x.Entitet == entitet)
          .And(x => x.EntitetId == entitetid);
        if (entitetopis != null)
          docs.And(x => x.EntitetOpis == entitetopis);
        DokumentDto result = null;
        var obj = docs.SelectList(list => list
          .Select(p => p.Id).WithAlias(() => result.Id)
          .Select(p => p.Opis).WithAlias(() => result.Opis)
          .Select(p => p.FileName).WithAlias(() => result.FileName)
          .Select(p => p.DateLastModified).WithAlias(() => result.DateLastModified)
          .Select(p => p.DateCreated).WithAlias(() => result.DateUploaded)
          .Select(p => p.Size).WithAlias(() => result.Size)
        )
        .TransformUsing(Transformers.AliasToBean<DokumentDto>())
        .List<DokumentDto>();

        return Json(new { Success = true, Message = "", obj = obj });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }
    [HttpGet]
    [Route("[Action]")]
    public ActionResult Brisi(int id)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {

        var sql = _session.CreateSQLQuery("exec BrisiDokument :id");
        sql.SetParameter("id", id, NHibernateUtil.Int32);
        var ret = sql.ExecuteUpdate();
        return Json(new { Success = true, Message = "", obj = ret });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromQuery] string entitet, int entitetid, string entitetopis, string filename, DateTime lastmodified, long size, [FromForm]  IFormFile file)
    {
      try
      {
        var dok = new Dokument() { FileName = filename, Entitet = entitet, EntitetId = entitetid, EntitetOpis = entitetopis, DateLastModified = lastmodified, Size = size };

        using (var ms = new MemoryStream())
        {
          await file.CopyToAsync(ms);
          dok.Data = ms.ToArray();
        }

        _session.SaveOrUpdate(dok);
        _session.Flush();

        return Json(new { Success = true, Message = "" });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }


    }

  }


}

