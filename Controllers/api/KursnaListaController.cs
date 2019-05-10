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
  public class KursnaListaController : Controller
  {
    private readonly ILogger _logger;
    private readonly ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    public KursnaListaController(ISession session, ILoggerFactory loggerFactory, Microsoft.AspNetCore.Http.IHttpContextAccessor contextAccessor)
    {
      _logger = loggerFactory.CreateLogger<KorisnikController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
    }

    [HttpGet]
    public ActionResult Get(int godina, string valuta)
    {
      try
      {
        var upit = _session.QueryOver<KursnaLista>()
          .Where(x => x.Godina == godina && x.Valuta == valuta);
        var rez = upit.List<KursnaLista>();

        //kreirati 52 nedelje ako ne postoji
        if (rez.Count == 0)
        {
          for (int i = 1; i <= 52; i++)
          {
            var kl = new KursnaLista() { Godina = godina, Valuta = valuta, Nedelja = i, Kurs = 1 };
            _session.SaveOrUpdate(kl);
            rez.Add(kl);
          }
        }

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

  }

  
}

