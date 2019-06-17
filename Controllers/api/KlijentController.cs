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
  public class KlijentController : Controller
  {
    private readonly ILogger _logger;
    private readonly ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public KlijentController(ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<KlijentController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }

    [HttpGet("{id}")]
    public Klijent Get(int id)
    {
      Klijent klijent;
      if (id == 0)
        klijent = new Klijent();
      else
        klijent = _session.Get<Klijent>(id);
      return klijent;
    }

    [HttpGet]
    [Route("[Action]")]
    public ActionResult dajSveKlijente()
    {
      var upit = _session.QueryOver<Klijent>().Where(x => !x.Obrisan);
      return Ok(upit.List<Klijent>());
    }


    [HttpGet]
    [Route("[Action]")]
    public int BrojDokumenata(string tip, int idklijent)
    {
      try
      {
        var query = _session.CreateSQLQuery("exec BrojDokumenata :tip, :idklijent");
        query.SetParameter("tip", tip, NHibernateUtil.String);
        query.SetParameter("idklijent", idklijent, NHibernateUtil.Int32);
        var result = query.UniqueResult<int>();
        return result;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex.Message);
        return 0;
      }

    }

    [HttpGet]
    [Route("[Action]")]
    public KlijentKontakt Kontakt(int id)
    {
      if (id == 0)
        return new KlijentKontakt();
      else
        return _session.Get<KlijentKontakt>(id);
    }


    [HttpPost]
    [Route("[Action]")]
    public KendoResult<KlijentPregled> PregledGrid([FromBody] KendoRequest kr) //Get([FromUri] FilterContainer filter, int take, int skip, int page, int pageSize)
    {

      //if (kr.Filter != null && kr.Filter.Filters.FirstOrDefault(x => x.Field == "all") != null)
      //{
      //    var sp = _session.CreateSQLQuery("exec KupacLookup")
      //}
      Ponuda ponuda = null;
      Klijent klijent = null;
      PonudaStavka ponudaStavka = null;
      KlijentPregled klijentPregled = null;

      var subEur = QueryOver.Of<Ponuda>()
                    .Where(p => !p.Obrisan)
                    .And(p => p.Klijent.Id == klijent.Id)
                    .And(p => p.Valuta == "EUR")
                    .JoinQueryOver(p => p.Stavke, () => ponudaStavka)
                    .SelectList(ls => ls
                      .SelectSum(() => ponudaStavka.Vrednost)
                    );

      var subRsd = QueryOver.Of<Ponuda>()
              .Where(p => !p.Obrisan)
              .And(p => p.Klijent.Id == klijent.Id)
              .And(p => p.Valuta == "RSD")
              .JoinQueryOver(p => p.Stavke, () => ponudaStavka)
              .SelectList(ls => ls
                .SelectSum(() => ponudaStavka.Vrednost)
              );

      var upit = _session.QueryOver<Klijent>(() => klijent)
          .Where(x => !x.Obrisan)
          .Select(Projections.ProjectionList()
            .Add(Projections.Property(() => klijent.Id), "Id")
            .Add(Projections.Property(() => klijent.Naziv), "Naziv")
            .Add(Projections.Property(() => klijent.Drzava), "Drzava")
            .Add(Projections.Property(() => klijent.Adresa), "Adresa")
            .Add(Projections.Property(() => klijent.Mesto), "Mesto")
            .Add(Projections.Property(() => klijent.Pib), "Pib")
            .Add(Projections.Property(() => klijent.Komentar), "Komentar")
            .Add(Projections.SubQuery(subRsd), "vrednostRsd")
            .Add(Projections.SubQuery(subEur), "vrednostEur")
        );
      //.SelectList(list => list
      //  .Select(k => k.Id).WithAlias(() => klijentPregled.Id)
      //  .Select(k => k.Naziv).WithAlias(() => klijentPregled.Naziv)
      //  .Select(k => k.Drzava).WithAlias(() => klijentPregled.Drzava)
      //  .Select(k => k.Mesto).WithAlias(() => klijentPregled.Mesto)
      //  .Select(k => k.Adresa).WithAlias(() => klijentPregled.Adresa)
      //  .Select(k => k.Pib).WithAlias(() => klijentPregled.Pib)
      //  .Select(k => k.Komentar).WithAlias(() => klijentPregled.Komentar)
      //  .SelectSubQuery(
      //    QueryOver.Of<Ponuda>()
      //      .Where(p => !p.Obrisan)
      //      .And(p => p.Klijent.Id == klijent.Id)
      //      .And(p => p.Valuta == "RSD")
      //      .JoinQueryOver(p => p.Stavke, () => ponudaStavka)
      //      .SelectList(ls => ls
      //        .SelectSum(() => ponudaStavka.Vrednost)
      //      )
      //  ).WithAlias(() => klijentPregled.VrednostRsd)
      //  .SelectSubQuery(
      //    QueryOver.Of<Ponuda>()
      //      .Where(p => !p.Obrisan)
      //      .And(p => p.Klijent.Id == klijent.Id)
      //      .And(p => p.Valuta == "EUR")
      //      .JoinQueryOver(p => p.Stavke, () => ponudaStavka)
      //      .SelectList(ls => ls
      //        .SelectSum(() => ponudaStavka.Vrednost)
      //      )
      //  ).WithAlias(() => klijentPregled.VrednostEur)
      //);






      var rowcount = _session.QueryOver<Klijent>()
          .Where(x => !x.Obrisan);




      TextInfo textInfo = CultureInfo.InvariantCulture.TextInfo;
      if (kr.Filter != null && kr.Filter.Filters.Any())
      {
        foreach (FilterDescription filter in kr.Filter.Filters)
        {
          string prop = filter.Field.FirstCharToUpper(); //textInfo.ToTitleCase(filter.Field);
          upit.Where(Restrictions.InsensitiveLike(prop, filter.Value, MatchMode.Anywhere));
          rowcount.Where(Restrictions.InsensitiveLike(prop, filter.Value, MatchMode.Anywhere));
        }
      }

      upit.Skip(kr.Skip);
      upit.Take(kr.Take);



      if (kr.Sort.Any())
      {
        foreach (Sort sort in kr.Sort)
        {
          string prop = sort.Field.FirstCharToUpper(); //textInfo.ToTitleCase(sort.Field);
          {
            //upit.UnderlyingCriteria.AddOrder(new Order(prop, sort.Dir.ToLower() == "asc"));
            if(sort.Field.Contains("vrednostEur"))
              upit.UnderlyingCriteria.AddOrder(new Order(Projections.SubQuery(subEur), sort.Dir.ToLower() == "asc"));
            else if (sort.Field.Contains("vrednostRsd"))
              upit.UnderlyingCriteria.AddOrder(new Order(Projections.SubQuery(subEur), sort.Dir.ToLower() == "asc"));
            else
              upit.UnderlyingCriteria.AddOrder(new Order(prop, sort.Dir.ToLower() == "asc"));
          }
        }
      }


      upit.TransformUsing(Transformers.AliasToBean<KlijentPregled>());
      upit.Future<KlijentPregled>();


      rowcount.Select(Projections.Count(Projections.Id()));

      var redova = rowcount.FutureValue<int>().Value;

      var lista = upit.List<KlijentPregled>();
      var res = new KendoResult<KlijentPregled>
      {
        Data = lista,
        Total = redova
      };
      return res;
    }



    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] Klijent obj)
    {

      try
      {
        if (obj.Id == 0)
          obj.Rbr = Helper.RedniBroj(_session, "klijent");

        foreach (var kontakt in obj.Kontakti)
        {
          kontakt.Klijent = obj;
          _session.SaveOrUpdate(kontakt);
        }

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


