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
  public class ZapisController : Controller
  {
    private readonly ILogger _logger;
    private readonly NHibernate.ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public ZapisController(NHibernate.ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<ZapisController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }


    [HttpGet("{id}")]
    public ActionResult Get(int id)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {

        var dokument = _session.Get<Zapis>(id);

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
    public ActionResult ZapisTemplate()
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {

        var dokument = new Zapis();
        return Ok(dokument);
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Lista(int nalogid)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {
        Zapis zapis = null;
        RadniNalog nalog = null;
        Korisnik odobrio = null;
        var docs = _session.QueryOver(() => zapis)
        .JoinAlias(x => x.RadniNalog, () => nalog)
        .Left.JoinAlias(x => x.Odobrio, () => odobrio)
          .Where(x => !x.Obrisan)
          .And(x => x.RadniNalog.Id == nalogid);


        ZapisDto result = null;
        var obj = docs.SelectList(list => list
          .Select(p => p.Id).WithAlias(() => result.Id)
          .Select(p => p.Rbr).WithAlias(() => result.Rbr)
          .Select(p => p.Opis).WithAlias(() => result.Opis)
          .Select(p => p.FileName).WithAlias(() => result.FileName)
          .Select(p => p.DateLastModified).WithAlias(() => result.DateLastModified)
          .Select(p => p.DateCreated).WithAlias(() => result.DateUploaded)
          .Select(p => p.Size).WithAlias(() => result.Size)
          .Select(p => p.Broj).WithAlias(() => result.Broj)
          .Select(p => p.Vrsta).WithAlias(() => result.Vrsta)
          .Select(p => p.Oznaka).WithAlias(() => result.Oznaka)
          .Select(p => p.Odobreno).WithAlias(() => result.Odobreno)
          .Select(p => p.Datum).WithAlias(() => result.Datum)
          .Select(p => p.DatumOdobrenja).WithAlias(() => result.DatumOdobrenja)
          .Select(p => p.Odobrio).WithAlias(() => result.Odobrio)
        )
        .TransformUsing(Transformers.AliasToBean<ZapisDto>())
        .List<ZapisDto>();

        return Json(new { Success = true, Message = "", obj = obj });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpPost]
    [Route("[Action]")]
    public KendoResult<ZapisDto> ListaSvi([FromBody] KendoRequest kr)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)

      Zapis zapis = null;
      RadniNalog radniNalog = null;
      Korisnik odobrio = null;
      Ponuda Ponuda = null;
      Klijent Klijent = null;
      var upit = _session.QueryOver<Zapis>(() => zapis)
        .JoinAlias(x => x.RadniNalog, () => radniNalog)
        .JoinAlias(() => radniNalog.Ponuda, () => Ponuda)
        .JoinAlias(()=> Ponuda.Klijent, () => Klijent)
        //.Left.JoinAlias(x => x.Odobrio, () => odobrio)
        .Where(x => !x.Obrisan);



      if (kr.Sort.Any())
      {
        foreach (Sort sort in kr.Sort)
        {
          string prop = sort.Field.FirstCharToUpper(); //textInfo.ToTitleCase(sort.Field);
          upit.UnderlyingCriteria.AddOrder(new Order(prop, sort.Dir.ToLower() == "asc"));
        }
      }
      if (kr.PageSize != 0)
      {
        upit.Skip(kr.Skip);
        upit.Take(kr.Take);
      }
      ZapisDto result = null;
      var obj = upit.SelectList(list => list
        .Select(p => p.Id).WithAlias(() => result.Id)
        .Select(p => p.Rbr).WithAlias(() => result.Rbr)
        .Select(p => p.Opis).WithAlias(() => result.Opis)
        .Select(p => p.FileName).WithAlias(() => result.FileName)
        .Select(p => p.DateLastModified).WithAlias(() => result.DateLastModified)
        .Select(p => p.DateCreated).WithAlias(() => result.DateUploaded)
        .Select(p => p.Size).WithAlias(() => result.Size)
        .Select(p => p.Broj).WithAlias(() => result.Broj)
        .Select(p => p.Vrsta).WithAlias(() => result.Vrsta)
        .Select(p => p.Oznaka).WithAlias(() => result.Oznaka)
        .Select(p => p.Odobreno).WithAlias(() => result.Odobreno)
        .Select(p => p.Datum).WithAlias(() => result.Datum)
        .Select(p => p.DatumOdobrenja).WithAlias(() => result.DatumOdobrenja)
        .Select(p => p.Odobrio).WithAlias(() => result.Odobrio)
        .Select(p => p.RadniNalog).WithAlias(() => result.RadniNalog)
      //.Select(() => ponuda).WithAlias(() => result.Ponuda)
      );



      upit.Future<ZapisDto>();
      upit.TransformUsing(new AliasToBeanResultTransformer(typeof(ZapisDto)));
      var rowcount = upit.ToRowCountQuery();

      rowcount.Select(Projections.Count(Projections.Id()));

      var redova = rowcount.FutureValue<int>().Value;

      var lista = upit.List<ZapisDto>();
      var res = new KendoResult<ZapisDto>
      {
        Data = lista,
        Total = redova
      };
      return res;

    }


    [HttpGet]
    [Route("[Action]")]
    public ActionResult Brisi(int id)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {

        var sql = _session.CreateSQLQuery("exec BrisiZapis :id");
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
    public async Task<ActionResult> Post([FromQuery] int zapisid, string filename, DateTime lastmodified, long size, [FromForm]  IFormFile file)
    {
      try
      {
        var dok = _session.Get<Zapis>(zapisid);


        //var kor = _session.QueryOver<Korisnik>()
        //        .Where(x => x.KorisnickoIme == User.Identity.Name)
        //        .SingleOrDefault<Korisnik>();

        //dok.Rbr = Helper.RedniBroj(_session, "zapis");
        using (var ms = new MemoryStream())
        {
          await file.CopyToAsync(ms);
          dok.Data = ms.ToArray();
          dok.Size = size;
          dok.FileName = filename;
          dok.DateLastModified = lastmodified;
        }

        _session.SaveOrUpdate(dok);
        _session.Flush();

        return Json(new { Success = true, Message = "", Objekat = dok });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }


    }
    [HttpPost]
    [Route("[Action]")]
    public ActionResult SnimiZapise([FromQuery] int nalogid, [FromBody] List<Zapis> zapisi)
    {

      try
      {
        var nalog = _session.Get<RadniNalog>(nalogid);

        foreach (var zapis in zapisi)
        {

          //zapis.Broj = nalog.PredmetNaloga.Oznaka ?? "" + "-" + nalog.DatumKreiranja.Year.ToString().Substring(2, 2) + " " + zapis.Rbr.ToString().PadLeft(4, '0') + "-" + zapis.Oznaka;



          zapis.RadniNalog = nalog;
          _session.SaveOrUpdate(zapis);
          _session.Flush();

        }
        return Json(new { Success = true, Message = "" });

      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }

    }



    [HttpPost]
    [Route("[Action]")]
    public ActionResult Snimi([FromQuery] int nalogid, [FromBody] Zapis obj)
    {

      try
      {
        var nalog = _session.Get<RadniNalog>(nalogid);
        obj.RadniNalog = nalog;

        if (obj.Id == 0)
        {
          obj.Rbr = Helper.RedniBroj(_session, "zapis", obj.Datum);

        }
        if (!string.IsNullOrEmpty(nalog.PredmetNaloga.Oznaka) && (obj.Oznaka == "I" || obj.Oznaka == "S" || obj.Oznaka == "Z"))
        {
          obj.Broj = nalog.PredmetNaloga.Oznaka + "-" + obj.Datum.Year.ToString().Substring(2, 2) + obj.Rbr.ToString().PadLeft(4, '0') + "-" + obj.Oznaka;
        }
        //var kn = Tuv.Helper.Helper.GetIso8601WeekOfYear(obj.Datum);

        //obj.Kn = kn;
        //var kurs = _session.QueryOver<KursnaLista>()
        //    .Where(x => x.Godina == obj.Datum.Year)
        //    .And(x => x.Nedelja == kn)
        //    .SingleOrDefault<KursnaLista>()
        //    .Kurs;

        //_session.Clear();
        _session.SaveOrUpdate(obj);
        _session.Flush();

        return Json(new { Success = true, Message = "", Objekat = obj }); ;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message, obj });

      }

    }
  }


}

