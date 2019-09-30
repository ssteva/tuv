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
using NHibernate.Transform;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Tuv.Controllers.api
{
  [Route("api/[controller]")]
  [Authorize("Bearer")]
  public class NalogController : Controller
  {
    private readonly ILogger _logger;
    private readonly ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public NalogController(ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<NalogController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }

    [HttpGet("{id}")]
    public RadniNalog Get(int id)
    {
      RadniNalog nalog = null;
      Ponuda ponuda = null;
      RadniNalogPredmet radniNalogPredmet = null;
      if (id == 0)
        nalog = new RadniNalog() { Id = 0, Status = 0, DatumKreiranja = DateTime.Now };
      else
      {
        nalog = _session.QueryOver<RadniNalog>()
          .Left.JoinAlias(x => x.Ponuda, () => ponuda)
          .Left.JoinAlias(x => x.PredmetNaloga, () => radniNalogPredmet)
          .Where(x => !x.Obrisan)
          .And(x => x.Id == id)
          .List<RadniNalog>()
          .FirstOrDefault();
      }
      return nalog;
    }


    [HttpGet]
    [Route("[Action]")]
    public RadniNalogPredmet RadniNalogPredmet(int id)
    {
      RadniNalogPredmet radniNalogPredmet;
      if (id == 0)
        radniNalogPredmet = new RadniNalogPredmet() { Id = 0 };
      else
        radniNalogPredmet = _session.Get<RadniNalogPredmet>(id);
      return radniNalogPredmet;
    }

    [HttpGet]
    [Route("[Action]")]
    public IList<RadniNalogStatus> NalogStatusi(int id)
    {
      var query = _session.QueryOver<RadniNalogStatus>().Where(x => !x.Obrisan).List<RadniNalogStatus>();
      return query;
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult NaloziPoKlijentu(int klijentid)
    {
      Ponuda ponuda = null;
      Klijent klijent = null;
      var upit = _session.QueryOver<RadniNalog>()
        .JoinAlias(x => x.Ponuda, () => ponuda)
        .JoinAlias(x => x.Ponuda.Klijent, () => klijent)
        .Where(x => !x.Obrisan)
        .And(() => ponuda.Klijent.Id == klijentid)
        .List<RadniNalog>();
      return Ok(upit);
    }
    [HttpPost]
    [Route("[Action]")]
    public KendoResult<RadniNalog> PregledGrid([FromBody] KendoRequest kr) //Get([FromUri] FilterContainer filter, int take, int skip, int page, int pageSize)
    {

      //if (kr.Filter != null && kr.Filter.Filters.FirstOrDefault(x => x.Field == "all") != null)
      //{
      //    var sp = _session.CreateSQLQuery("exec KupacLookup")
      //}
      RadniNalog nalog = null;
      Klijent klijent = null;
      Ponuda ponuda = null;
      RadniNalogStatus nalogStatus = null;
      //RadniNalogPredmet radniNalogPredmet = null;
      ObimPoslovanja obim = null;
      var upit = _session.QueryOver(() => nalog)
          .Where(x => x.Obrisan == false);


      upit.JoinAlias(x => x.Ponuda, () => ponuda)
        .JoinAlias(x => x.Ponuda.Klijent, () => klijent)
        .JoinAlias(x => x.PredmetNaloga, () => obim)
        .JoinAlias(x => x.RadniNalogStatus, () => nalogStatus);
      //.JoinAlias(x => x.PredmetNaloga, () => radniNalogPredmet)
      //.JoinAlias(() => radniNalogPredmet.ObimPoslovanja, () => obim);



      //TextInfo textInfo = CultureInfo.InvariantCulture.TextInfo;
      if (kr.Filter != null && kr.Filter.Filters.Any())
      {
        foreach (FilterDescription filter in kr.Filter.Filters)
        {
          //string prop = textInfo.ToTitleCase(filter.Field);
          string prop = filter.Field.FirstCharToUpper();

          if (prop.ToLower().Contains("ponuda.klijent.id"))
          {
            upit.And(() => ponuda.Klijent.Id == int.Parse(filter.Value));

          }
          else if (prop.ToLower().Contains("nalogstatus"))
          {
            upit.And(() => nalogStatus.Id == int.Parse(filter.Value));
          }
          else if (prop.ToLower().Contains("predmetnaloga"))
          {
            upit.And(Restrictions.Disjunction()
                 .Add(Restrictions.On(() => obim.Sifra)
                     .IsInsensitiveLike(filter.Value, MatchMode.Anywhere))
                 .Add(Restrictions.On(() => obim.Naziv)
                     .IsInsensitiveLike(filter.Value, MatchMode.Anywhere)));
          }
          else if (prop.ToLower().Contains("klijent.naziv"))
          {
            upit.AndRestrictionOn(() => klijent.Naziv).IsInsensitiveLike(filter.Value, MatchMode.Anywhere);

          }
          else if (prop.Contains("DatumKreiranja"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumKreiranja >= d);

            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumKreiranja <= d);
            }
          }
          else
          {
            upit.Where(Restrictions.InsensitiveLike(prop, filter.Value, MatchMode.Anywhere));

          }
        }
      }


      var rowcount = upit.ToRowCountQuery();
      if (kr.PageSize != 0)
      {
        upit.Skip(kr.Skip);
        upit.Take(kr.Take);
      }

      if (kr.Sort.Any())
      {
        foreach (Sort sort in kr.Sort)
        {
          string prop = sort.Field.FirstCharToUpper(); //textInfo.ToTitleCase(sort.Field);
          upit.UnderlyingCriteria.AddOrder(new Order(prop, sort.Dir.ToLower() == "asc"));
        }
      }



      upit.Future<RadniNalog>();
      //supit.TransformUsing(Transformers.DistinctRootEntity);


      //rowcount.Select(Projections.Count(Projections.Id()));

      var redova = rowcount.FutureValue<int>().Value;

      var lista = upit.List<RadniNalog>();
      var res = new KendoResult<RadniNalog>
      {
        Data = lista,
        Total = redova
      };
      return res;
    }

    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] RadniNalog obj)
    {

      try
      {
        


        if (obj.Id == 0)
        {

          obj.Rbr = Helper.RedniBroj(_session, "nalog", DateTime.Now);
          var broj = "RN " + obj.Rbr.ToString().PadLeft(4, '0') + "/" + obj.DatumKreiranja.Year.ToString().Substring(2, 2);
          obj.Broj = broj;
          obj.Status = 1;
          obj.DatumKreiranja = DateTime.Now;
          var korisnik = _session.QueryOver<Korisnik>()
          .Where(x => x.KorisnickoIme == User.Identity.Name)
          .SingleOrDefault<Korisnik>();
          var poruka = "Kreiran radni nalog";
          var zaduzen = _session.Load<Korisnik>(obj.ZaduzenZaRealizaciju.Id);
          var poruka2 = "Kreiran radni nalog - izvršitelj " + zaduzen.Naziv ?? "";
          var tip = "Kreiranje";
          var wf = new RadniNalogWf() { RadniNalog = obj, Datum = DateTime.Now, Korisnik = korisnik, Opis = poruka, Tip = tip, TimelineIkona = "timeline_icon_primary", Ikona = "assignment" };
          var wfp = new PonudaWf() { Ponuda = obj.Ponuda, Datum = DateTime.Now, Korisnik = korisnik, Opis = poruka2, Tip = tip, TimelineIkona = "timeline_icon_default", Ikona = "build" };
          _session.Save(wfp);
          obj.Wfs.Add(wf);
        }
        if (obj.Id != 0)
        {

          var nalog = _session.Load<RadniNalog>(obj.Id);
          if(nalog.Zatvoren != obj.Zatvoren)
          {
            string poruka;
            string tip;
            string ikona;
            if (obj.Zatvoren)
            {
              poruka = "Zatvoren radni nalog";
              tip = "Zatvaranje";
              ikona = "lock";
            }
            else
            {
              poruka = "Otvoren radni nalog";
              tip = "Otvaranje";
              ikona = "lock_open";
            }

            var korisnik = _session.QueryOver<Korisnik>()
                    .Where(x => x.KorisnickoIme == User.Identity.Name)
                    .SingleOrDefault<Korisnik>();
            
            var wf = new RadniNalogWf() { RadniNalog = obj, Datum = DateTime.Now, Korisnik = korisnik, Opis = poruka, Tip = tip, TimelineIkona = "timeline_icon_primary", Ikona = ikona };
            _session.Save(wf);
          }

          var status = _session.CreateSQLQuery("exec StatusNaloga :id")
            .SetParameter("id", obj.Id)
                   .UniqueResult<int>();
          obj.Status = status;
        }
        ObradaStavki(obj);

        _session.Clear();
        _session.SaveOrUpdate(obj);
        _session.Flush();
        return Json(new { Success = true, Message = "", Obj = obj });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message, Obj = obj });

      }

    }

    private RadniNalog ObradaStavki(RadniNalog obj)
    {
      //foreach (var predmet in obj.PredmetNaloga)
      //{
      //  if (predmet.RadniNalog == null)
      //  {
      //    predmet.RadniNalog = obj;
      //  }
      //}

      foreach (var wf in obj.Wfs)
      {
        if (wf.RadniNalog == null)
        {
          wf.RadniNalog = obj;
        }
      }

      //foreach (var stavka in obj.Stavke)
      //{
      //  if (stavka.Ponuda == null)
      //  {
      //    stavka.Ponuda = obj;
      //    stavka.Vrednost = stavka.Kolicina * stavka.Cena;
      //  }

      //}
      return obj;
    }

  }
}

