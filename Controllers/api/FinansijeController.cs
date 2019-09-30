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
  public class FinansijeController : Controller
  {
    private readonly ILogger _logger;
    private readonly NHibernate.ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public FinansijeController(NHibernate.ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<FinansijeController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }


    [HttpGet("{id}")]
    [Route("[Action]")]
    public Uplata Uplata(int id)
    {
      Uplata uplata = null;
      if (id == 0)
        uplata = new Uplata() { Id = 0, Valuta = "RSD" };
      else
      {
        uplata = _session.QueryOver<Uplata>()
          .Where(x => !x.Obrisan)
          .And(x => x.Id == id)
          .List<Uplata>()
          .FirstOrDefault();
      }
      return uplata;
    }

    [HttpGet("{id}")]
    [Route("[Action]")]
    public Faktura Faktura(int id)
    {
      Faktura faktura = null;
      if (id == 0)
        faktura = new Faktura() { Id = 0, Valuta = "RSD" };
      else
      {
        faktura = _session.QueryOver<Faktura>()
          .Where(x => !x.Obrisan)
          .And(x => x.Id == id)
          .List<Faktura>()
          .FirstOrDefault();
      }
      return faktura;
    }
    [HttpGet("{id}")]
    [Route("[Action]")]
    public Finansije Finansije(int id, string vrsta)
    {
      Finansije finansije = null;
      if (id == 0)
        finansije = new Finansije() { Id = 0, Valuta = "RSD", Vrsta = vrsta.ToUpper() };
      else
      {
        finansije = _session.QueryOver<Finansije>()
          .Where(x => !x.Obrisan)
          .And(x => x.Id == id)
          .List<Finansije>()
          .FirstOrDefault();
      }
      return finansije;
    }
    [HttpGet]
    [Route("[Action]")]
    public ActionResult ListaUplata(int nalogid)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {
        Uplata uplata = null;
        RadniNalog nalog = null;
        var obj = _session.QueryOver(() => uplata)
        .JoinAlias(x => x.RadniNalog, () => nalog)
        .Fetch(SelectMode.JoinOnly, x => x.RadniNalog)
        .Where(x => !x.Obrisan)
        .And(x => x.RadniNalog.Id == nalogid)
        .List<Uplata>();

        return Json(new { Success = true, Message = "", obj });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }


    [HttpGet]
    [Route("[Action]")]
    public ActionResult ListaFaktura(int nalogid)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {
        Faktura faktura = null;
        RadniNalog nalog = null;
        var obj = _session.QueryOver(() => faktura)
        .JoinAlias(x => x.RadniNalog, () => nalog)
        .Fetch(SelectMode.JoinOnly, x => x.RadniNalog)
        .Where(x => !x.Obrisan)
        .And(x => x.RadniNalog.Id == nalogid)
        .List<Faktura>();

        return Json(new { Success = true, Message = "", obj });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Lista(int nalogid, string vrsta)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {
        Finansije finansije = null;
        RadniNalog nalog = null;
        var obj = _session.QueryOver(() => finansije)
        .JoinAlias(x => x.RadniNalog, () => nalog)
        .Fetch(SelectMode.JoinOnly, x => x.RadniNalog)
        .Where(x => !x.Obrisan)
        .And(x => x.RadniNalog.Id == nalogid)
        .And(x => x.Vrsta == vrsta)
        .List<Finansije>();

        return Json(new { Success = true, Message = "", obj });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult BrisiUplatu(int id)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {

        var obj = _session.Load<Uplata>(id);
        obj.Obrisan = true;
        _session.SaveOrUpdate(obj);
        _session.Flush();
        return Json(new { Success = true, Message = "", obj = true });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }


    [HttpGet]
    [Route("[Action]")]
    public ActionResult BrisiFakturu(int id)
    {
      //this.repo.find("Dokument?entitet=" + entitet + "&entitetopis=" + entitetoipis + "&entitetid" + entitet)
      try
      {

        var obj = _session.Load<Faktura>(id);
        obj.Obrisan = true;
        _session.SaveOrUpdate(obj);
        _session.Flush();
        return Json(new { Success = true, Message = "", obj = true });
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

        var obj = _session.Load<Finansije>(id);
        obj.Obrisan = true;
        _session.SaveOrUpdate(obj);
        _session.Flush();
        return Json(new { Success = true, Message = "", obj = true });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult Rekapitulacija(DateTime? dat1, DateTime? dat2, int klijentid, int ponudaid, int radninalogid)
    {



      try
      {

        var upit = _session.CreateSQLQuery("exec rekapitulacija :dat1, :dat2, :klijentid, :ponudaid, :radninalogid")
          .SetParameter("dat1", null, NHibernateUtil.Date)
          .SetParameter("dat2", null, NHibernateUtil.Date)
          .SetParameter("klijentid", null, NHibernateUtil.Int32)
          .SetParameter("ponudaid", null, NHibernateUtil.Int32)
          .SetParameter("radninalogid", null, NHibernateUtil.Int32);

        if (dat1.HasValue)
        {
          upit.SetParameter("dat1", dat1.Value, NHibernateUtil.Date);
        }
        if (dat2.HasValue)
        {
          upit.SetParameter("dat2", dat2.Value, NHibernateUtil.Date);
        }
        if (klijentid != 0) {
          upit.SetParameter("klijentid", klijentid, NHibernateUtil.Int32);
        }
        if (ponudaid != 0)
        {
          upit.SetParameter("ponudaid", ponudaid, NHibernateUtil.Int32);
        }
        if (radninalogid != 0)
        {
          upit.SetParameter("radninalogid", radninalogid, NHibernateUtil.Int32);
        }
        var rekap = upit.SetResultTransformer(new AliasToBeanResultTransformer(typeof(Rekapitulacija)))
        .UniqueResult<Rekapitulacija>();



        return Json(new { Success = true, Message = "", obj = rekap });
      }

      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });
      }
    }

    [HttpPost]
    [Route("[Action]")]
    public ActionResult SnimiUplatu([FromQuery] int nalogid, [FromBody] Uplata obj)
    {

      try
      {
        var nalog = _session.Load<RadniNalog>(nalogid);
        obj.RadniNalog = nalog;
        var kn = Tuv.Helper.Helper.GetIso8601WeekOfYear(obj.Datum);

        //obj.Kn = kn;
        var kurs = _session.QueryOver<KursnaLista>()
            .Where(x => x.Godina == obj.Datum.Year)
            .And(x => x.Nedelja == kn)
            .SingleOrDefault<KursnaLista>()
            .Kurs;
        obj.Kurs = kurs;
        _session.SaveOrUpdate(obj);
        _session.Flush();
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message, obj });

      }
      return Json(new { Success = true, Message = "", obj });
    }

    [HttpPost]
    [Route("[Action]")]
    public ActionResult SnimiFakturu([FromQuery] int nalogid, [FromBody] Finansije obj)
    {

      try
      {
        var nalog = _session.Get<RadniNalog>(nalogid);
        obj.RadniNalog = nalog;
        obj.Rbr = Helper.RedniBroj(_session, "finansije" + obj.Vrsta.ToLower(), obj.Datum);
        var kn = Tuv.Helper.Helper.GetIso8601WeekOfYear(obj.Datum);

        //obj.Kn = kn;
        var kurs = _session.QueryOver<KursnaLista>()
            .Where(x => x.Godina == obj.Datum.Year)
            .And(x => x.Nedelja == kn)
            .SingleOrDefault<KursnaLista>()
            .Kurs;
        obj.Kurs = kurs;
        _session.SaveOrUpdate(obj);
        _session.Flush();
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message, Obj = obj });

      }
      return Json(new { Success = true, Message = "", Obj = obj });
    }


    [HttpPost]
    [Route("[Action]")]
    public ActionResult Snimi([FromQuery] int nalogid, [FromBody] Finansije obj)
    {

      try
      {
        var nalog = _session.Get<RadniNalog>(nalogid);
        obj.RadniNalog = nalog;

        if (obj.Vrsta == "U")
        {
          decimal uplata = obj.Iznos;
          var rekap = _session.CreateSQLQuery("exec rekapitulacija :dat1, :dat2, :klijentid, :ponudaid, :radninalogid")
            .SetParameter("dat1", null, NHibernateUtil.Date)
            .SetParameter("dat2", null, NHibernateUtil.Date)
            .SetParameter("klijentid", null, NHibernateUtil.Int32)
            .SetParameter("ponudaid", null, NHibernateUtil.Int32)
            .SetParameter("radninalogid", nalogid, NHibernateUtil.Int32)
            .SetResultTransformer(new AliasToBeanResultTransformer(typeof(Rekapitulacija)))
            .UniqueResult<Rekapitulacija>();

          if (nalog.Valuta == "EUR")
          {
            uplata += rekap.UplataE;
            if (uplata > rekap.FakturaE)
            {
              return Json(new { Success = false, Message = "Uplata je veća od fakture", obj });
            }
          }
          if (nalog.Valuta == "RSD")
          {
            uplata += rekap.UplataR;
            if (uplata > rekap.FakturaR)
            {
              return Json(new { Success = false, Message = "Uplata je veća od fakture", obj });
            }
          }
        }




        if (obj.Id == 0)
        {
          obj.Rbr = Helper.RedniBroj(_session, obj.Vrsta, obj.Datum);
          var stopa = _session.QueryOver<Parametar>()
            .Where(x => x.Vrsta == "PoreskaStopa")
            .SingleOrDefault<Parametar>()
            .Vredpar3;
          obj.PoreskaStopa = (int)stopa;
        }

        var kn = Tuv.Helper.Helper.GetIso8601WeekOfYear(obj.Datum);

        //obj.Kn = kn;
        var kurs = _session.QueryOver<KursnaLista>()
            .Where(x => x.Godina == obj.Datum.Year)
            .And(x => x.Nedelja == kn)
            .SingleOrDefault<KursnaLista>()
            .Kurs;
        obj.Kurs = kurs;
        _session.SaveOrUpdate(obj);
        _session.Flush();

        var status = _session.CreateSQLQuery("exec StatusNaloga :id")
         .SetParameter("id", nalogid)
         .UniqueResult<int>();
        nalog.Status = status;
        if (string.IsNullOrEmpty(nalog.Valuta))
        {
          nalog.Valuta = obj.Valuta;
        }
        _session.SaveOrUpdate(nalog);
        _session.Flush();
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message, obj });

      }
      return Json(new { Success = true, Message = "", obj });
    }
  }


}

