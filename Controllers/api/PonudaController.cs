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
      if (id == 0)
        ponuda = new Ponuda() { Id=0, Status = 0, Valuta="RSD" };


      else
        ponuda = _session.Get<Ponuda>(id);
      return ponuda;
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

      var upit = _session.QueryOver<Ponuda>(()=>ponuda)
          .Where(x => x.Obrisan == false);
      var rowcount = _session.QueryOver<Ponuda>(() => ponuda)
          .Where(x => x.Obrisan == false);

      upit.JoinAlias(x => x.Klijent, () => klijent);
      rowcount.JoinAlias(x => x.Klijent, () => klijent);

      TextInfo textInfo = CultureInfo.InvariantCulture.TextInfo;
      if (kr.Filter != null && kr.Filter.Filters.Any())
      {
        foreach (FilterDescription filter in kr.Filter.Filters)
        {
          string prop = textInfo.ToTitleCase(filter.Field);

          if (prop.ToLower().Contains("klijent.id"))
          {
            upit.And(() => klijent.Id == int.Parse(filter.Value));
            rowcount.And(() => klijent.Id == int.Parse(filter.Value));
          }
          else if (prop.ToLower().Contains("klijent.naziv"))
          {
            upit.AndRestrictionOn(() => klijent.Naziv).IsInsensitiveLike(filter.Value, MatchMode.Anywhere);
            rowcount.AndRestrictionOn(() => klijent.Naziv).IsInsensitiveLike(filter.Value, MatchMode.Anywhere);
          }
          else if (filter.Value == "Da" || filter.Value == "Ne")
          {
            var f = filter.Value != "Ne";
            upit.And(Restrictions.Eq(prop, f));
            rowcount.And(Restrictions.Eq(prop, f));
          }
          else if (prop.Contains("DatumPonude"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumPonude >= d);
              rowcount.And(x => x.DatumPonude >= d);
            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumPonude <= d);
              rowcount.And(x => x.DatumPonude <= d);
            }
          }
          else if (prop.Contains("DatumPrihvatanja"))
          {
            var d = Convert.ToDateTime(filter.Value);
            filter.Value = d.ToLocalTime().ToString("yyyyMMdd");
            if (filter.Operator == "gte")
            {
              upit.And(x => x.DatumPrihvatanja.Value >= d);
              rowcount.And(x => x.DatumPrihvatanja.Value >= d);
            }
            if (filter.Operator == "lte")
            {
              upit.And(x => x.DatumPrihvatanja.Value <= d);
              rowcount.And(x => x.DatumPrihvatanja.Value <= d);
            }
          }
          else
          {
            upit.Where(Restrictions.InsensitiveLike(prop, filter.Value, MatchMode.Anywhere));
            rowcount.Where(Restrictions.InsensitiveLike(prop, filter.Value, MatchMode.Anywhere));
          }
        }
      }

      upit.Skip(kr.Skip);
      upit.Take(kr.Take);

      if (kr.Sort.Any())
      {
        foreach (Sort sort in kr.Sort)
        {
          string prop = textInfo.ToTitleCase(sort.Field);
          upit.UnderlyingCriteria.AddOrder(new Order(prop, sort.Dir.ToLower() == "asc"));
        }
      }



      upit.Future<Ponuda>();


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



    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] Ponuda obj)
    {

      try
      {
        if (obj.Id == 0)
          obj.Rbr = Helper.RedniBroj(_session, "ponuda");


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

  }
}

