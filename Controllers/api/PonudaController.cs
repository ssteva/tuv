﻿using System;
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
  public class PonudaController : Controller
  {
    private readonly ILogger _logger;
    private readonly ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public PonudaController(ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<PonudaController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }

    [HttpGet("{id}")]
    public Ponuda Get(int id)
    {
      Ponuda ponuda;
      PonudaPredmet ponudaPredmet = null;
      PonudaStavka ponudaStavka = null;
      if (id == 0)
        ponuda = new Ponuda() { Id = 0, Status = 0, Valuta = "RSD", Vazenje = "Mesec", Vazi = 3 };


      else
      {
        ponuda = _session.QueryOver<Ponuda>()
          .Left.JoinAlias(x => x.PredmetPonude, () => ponudaPredmet)
          .Left.JoinAlias(x => x.Stavke, () => ponudaStavka)
          .Where(x => !x.Obrisan)
          .And(x => x.Id == id)
          .And(x => !ponudaPredmet.Obrisan || ponudaPredmet.Id == null)
          .And(x => !ponudaStavka.Obrisan || ponudaStavka.Id == null)
          .List<Ponuda>()
          .FirstOrDefault();
      }
      return ponuda;
    }
    [HttpGet]
    [Route("[Action]")]
    public PonudaStavka PonudaStavka(int id)
    {
      PonudaStavka ponudaStavka;
      if (id == 0)
        ponudaStavka = new PonudaStavka() { Id = 0 };
      else
        ponudaStavka = _session.Get<PonudaStavka>(id);
      return ponudaStavka;
    }
    [HttpGet]
    [Route("[Action]")]
    public PonudaPredmet PonudaPredmet(int id)
    {
      PonudaPredmet ponudaPredmet;
      if (id == 0)
        ponudaPredmet = new PonudaPredmet() { Id = 0 };
      else
        ponudaPredmet = _session.Get<PonudaPredmet>(id);
      return ponudaPredmet;
    }
    [HttpPost]
    [Route("[Action]")]
    public KendoResult<Ponuda> PregledGrid([FromBody] KendoRequest kr) //Get([FromUri] FilterContainer filter, int take, int skip, int page, int pageSize)
    {

      //if (kr.Filter != null && kr.Filter.Filters.FirstOrDefault(x => x.Field == "all") != null)
      //{
      //    var sp = _session.CreateSQLQuery("exec KupacLookup")
      //}

      Klijent klijent = null;
      Ponuda ponuda = null;
      PonudaPredmet ponudaPredmet = null;
      ObimPoslovanja obim = null;
      var upit = _session.QueryOver<Ponuda>(() => ponuda)
          .Where(x => x.Obrisan == false);


      upit.JoinAlias(x => x.Klijent, () => klijent)
        .JoinAlias(x => x.PredmetPonude, () => ponudaPredmet)
        .JoinAlias(() => ponudaPredmet.ObimPoslovanja, () => obim);
        


      TextInfo textInfo = CultureInfo.InvariantCulture.TextInfo;
      if (kr.Filter != null && kr.Filter.Filters.Any())
      {
        foreach (FilterDescription filter in kr.Filter.Filters)
        {
          //string prop = textInfo.ToTitleCase(filter.Field);
          string prop = filter.Field.FirstCharToUpper();

          if (prop.ToLower().Contains("klijent.id"))
          {
            upit.And(() => klijent.Id == int.Parse(filter.Value));
            
          }
          else if (prop.ToLower().Contains("predmetponude"))
          {
            upit.And(Restrictions.Disjunction()
                 .Add(Restrictions.On(() => obim.Sifra)
                     .IsInsensitiveLike(filter.Value, MatchMode.Anywhere))
                 .Add(Restrictions.On(() => obim.Naziv)
                     .IsInsensitiveLike(filter.Value, MatchMode.Anywhere)));

          }
          else if (prop.ToLower().Contains("vrednost") && filter.Operator == "eq")
          {
            upit.And(p=>p.Vrednost== decimal.Parse(filter.Value));
            
          }
          else if (prop.ToLower().Contains("vrednost") && filter.Operator == "gt")
          {
            upit.And(p => p.Vrednost >= decimal.Parse(filter.Value));
            
          }
          else if (prop.ToLower().Contains("vrednost") && filter.Operator == "gt")
          {
            upit.And(p => p.Vrednost <= decimal.Parse(filter.Value));
            
          }
          else if (prop.ToLower().Contains("rbr"))
          {
            upit.And(() => ponuda.Id == int.Parse(filter.Value));
            
          }
          else if (prop.ToLower().Contains("klijent.naziv"))
          {
            upit.AndRestrictionOn(() => klijent.Naziv).IsInsensitiveLike(filter.Value, MatchMode.Anywhere);
            
          }
          else if (filter.Value == "Da" || filter.Value == "Ne")
          {
            var f = filter.Value != "Ne";
            upit.And(Restrictions.Eq(prop, f));
            
          }
          else if (prop.Contains("DatumPonude"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumPonude >= d);
            
            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumPonude <= d);
            
            }
          }
          else if (prop.Contains("DatumVazenja"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumVazenja >= d);
            
            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumVazenja <= d);
            
            }
          }
          else if (prop.Contains("DatumPrihvatanja"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumPrihvatanja.Value >= d);
          
            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumPrihvatanja.Value <= d);
          
            }
          }
          else if (prop.Contains("DatumOdobrenjaR"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumOdobrenjaR.Value >= d);
          
            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumOdobrenjaR.Value <= d);
          
            }
          }
          else if (prop.Contains("DatumOdobrenjaD"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumOdobrenjaD.Value >= d);
          
            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumOdobrenjaD.Value <= d);
          
            }
          }
          else
          {
            upit.Where(Restrictions.InsensitiveLike(prop, filter.Value, MatchMode.Anywhere));
          
          }
        }
      }
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



      upit.Future<Ponuda>();
      upit.TransformUsing(Transformers.DistinctRootEntity);
      var rowcount = upit.ToRowCountQuery();

      rowcount.Select(Projections.Count(Projections.Id()));

      var redova = rowcount.FutureValue<int>().Value;

      var lista = upit.List<Ponuda>();
      var res = new KendoResult<Ponuda>
      {
        Data = lista,
        Total = redova
      };
      return res;
    }

    [HttpPost]
    [Route("[Action]")]
    public ActionResult Odobrenje([FromQuery] bool ishod, string komentar, [FromBody] Ponuda obj)
    {

      try
      {

        ObradaStavki(obj);

        var korisnik = _session.QueryOver<Korisnik>()
                .Where(x => x.KorisnickoIme == User.Identity.Name)
                .SingleOrDefault<Korisnik>();

        //var kn = Tuv.Helper.Helper.GetIso8601WeekOfYear(obj.DatumPonude);
        //var kurs = _session.QueryOver<KursnaLista>()
        //    .Where(x => x.Godina == obj.DatumPonude.Year)
        //    .And(x => x.Nedelja == kn)
        //    .SingleOrDefault<KursnaLista>()
        //    .Kurs;






        if (korisnik.Uloge.Contains("Rukovodilac") || korisnik.Uloge.Contains("Administrator"))
        {
          obj.OdobrenaR = ishod;
          if (ishod)
            obj.DatumOdobrenjaR = DateTime.Now;
        }
        if (korisnik.Uloge.Contains("Direktor"))
        {
          obj.OdobrenaD = ishod;
          if (ishod)
            obj.DatumOdobrenjaD = DateTime.Now;
        }



        if (obj.OdobrenaR.GetValueOrDefault() && !obj.PotrebnoOdobrenjeDirektora)
          obj.Status = 2;
        if (obj.OdobrenaR.GetValueOrDefault() && obj.OdobrenaD.GetValueOrDefault() && obj.PotrebnoOdobrenjeDirektora)
          obj.Status = 2;

        var poruka = ishod ? "Ponuda je odobrena" : "Ponuda nije odobrena";

        var tip = "Odobravanje";
        var wf = new PonudaWf() { Ponuda = obj, Datum = DateTime.Now, Korisnik = korisnik, Opis = poruka, Tip = tip, Ishod = ishod, IshodOpis = komentar };
        obj.Wfs.Add(wf);

        _session.SaveOrUpdate(obj);
        //_session.SaveOrUpdate(wf);
        _session.Flush();
        return Json(new { Success = true, Message = "", Obj = obj });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }

    }
    [HttpPost]
    [Route("[Action]")]
    public ActionResult Prihvatanje([FromQuery] bool ishod, [FromBody] Ponuda obj)
    {

      try
      {

        ObradaStavki(obj);

        var korisnik = _session.QueryOver<Korisnik>()
                .Where(x => x.KorisnickoIme == User.Identity.Name)
                .SingleOrDefault<Korisnik>();

        obj.Prihvacena = ishod;

        obj.DatumPrihvatanja = DateTime.Now;
        obj.Status = 3;
        var poruka = ishod ? "Ponuda je prihvaćena" : "Ponuda nije prihvaćena";

        var tip = "Prihvatanje";
        var wf = new PonudaWf() { Ponuda = obj, Datum = DateTime.Now, Korisnik = korisnik, Opis = poruka, Tip = tip, Ishod = ishod, IshodOpis = poruka };
        obj.Wfs.Add(wf);

        _session.SaveOrUpdate(obj);
        
        _session.Flush();
        return Json(new { Success = true, Message = "", Obj = obj });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return Json(new { Success = false, Message = ex.Message });

      }

    }
    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] Ponuda obj)
    {

      try
      {
        if (obj.Id == 0)
        {
          obj.Rbr = Helper.RedniBroj(_session, "ponuda");
          obj.Status = 1;
          var korisnik = _session.QueryOver<Korisnik>()
          .Where(x => x.KorisnickoIme == User.Identity.Name)
          .SingleOrDefault<Korisnik>();
          var poruka = "Kreirana ponuda";
          var tip = "Kreiranje";
          var wf = new PonudaWf() { Ponuda = obj, Datum = DateTime.Now, Korisnik = korisnik, Opis = poruka, Tip = tip };
          obj.Wfs.Add(wf);
        }

        ObradaStavki(obj);

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

    private Ponuda ObradaStavki(Ponuda obj)
    {
      foreach (var predmet in obj.PredmetPonude)
      {
        if (predmet.Ponuda == null)
        {
          predmet.Ponuda = obj;
        }
      }

      foreach (var wf in obj.Wfs)
      {
        if (wf.Ponuda == null)
        {
          wf.Ponuda = obj;
        }
      }

      foreach (var stavka in obj.Stavke)
      {
        if (stavka.Ponuda == null)
        {
          stavka.Ponuda = obj;
        }
        if (stavka.Id == 0)
        {
          var kn = Tuv.Helper.Helper.GetIso8601WeekOfYear(obj.DatumPonude);
          var kurs = _session.QueryOver<KursnaLista>()
              .Where(x => x.Godina == obj.DatumPonude.Year)
              .And(x => x.Nedelja == kn)
              .SingleOrDefault<KursnaLista>()
              .Kurs;
          stavka.Kurs = kurs;
        }
      }
      return obj;
    }

  }
}
