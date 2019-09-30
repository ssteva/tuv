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
using TemplateEngine.Docx;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Tuv.Controllers.api
{
  [Route("api/[controller]")]
  [Authorize("Bearer")]
  public class TemplateController : Controller
  {
    private readonly ILogger _logger;
    private readonly NHibernate.ISession _session;
    private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
    private readonly IHostingEnvironment _hostingEnvironment;
    public TemplateController(NHibernate.ISession session, ILoggerFactory loggerFactory, IHttpContextAccessor contextAccessor, IHostingEnvironment hostingEnvironment)
    {
      _logger = loggerFactory.CreateLogger<TemplateController>();
      _session = session;
      _httpContextAccessor = contextAccessor;
      _hostingEnvironment = hostingEnvironment;
    }

    [HttpGet("{id}")]
    public FileResult Get(int id)
    {

      try
      {

        //var dokument = _session.Get<Dokument>(3);

        //var ms = new MemoryStream(dokument.Data);
        //ms.Seek(0, SeekOrigin.Begin);
        //return File(ms, "application/octet-stream", dokument.FileName); // returns a FileStreamResult


        var ponuda = _session.Get<Ponuda>(id);

        var filepath = Path.Combine(_hostingEnvironment.WebRootPath, "assets", "templates", "Ponuda.docx");
        //var outputfilepath = Path.Combine(_hostingEnvironment.WebRootPath, "assets", "templates", "ponuda2.docx");
        using (FileStream fs = new FileStream(filepath, FileMode.Open, FileAccess.ReadWrite))
        {


          var stream = new MemoryStream();

          fs.CopyTo(stream);
          stream.Seek(0, SeekOrigin.Begin);
          using (var outputDocument = new TemplateProcessor(stream).SetRemoveContentControls(true))
          {
            var valuesToFill = new Content(
                new FieldContent("BrojPonude", ponuda.Broj)
                , new FieldContent("KlijentNaziv", ponuda.Klijent.Naziv)
                , new FieldContent("KlijentAdresa", ponuda.Klijent.Adresa ?? "")
                , new FieldContent("KlijentKontakt", ponuda.KlijentKontakt?.Ime ?? "")
                , new FieldContent("KlijentKontaktEmail", ponuda.KlijentKontakt?.Email ?? "")
                , new FieldContent("ZaduzenIme", ponuda.ZaduzenZaPonudu?.Naziv ?? "")
                , new FieldContent("ZaduzenEmail", ponuda.ZaduzenZaPonudu?.Email ?? "")
                , new FieldContent("ZaduzenTelefon", ponuda.ZaduzenZaPonudu?.Telefon ?? "")
                , new FieldContent("ZaduzenMobilni", ponuda.ZaduzenZaPonudu?.Mobilni ?? "")
                , new FieldContent("TipProizvoda", ponuda.TipProizvoda ?? "")
                , new FieldContent("Proizvodjac", ponuda.Proizvodjac ?? "")
                , new FieldContent("PrimenjiviZahtevi", ponuda.PrimenjiviZahtevi ?? "")
                , new FieldContent("PredvidjenoVreme", ponuda.PredvidjenoVremeZaRealizaciju ?? "")
                , new FieldContent("BitneNapomene", ponuda.BitneNapomene ?? "")
                , new FieldContent("CenaUsloviPlacanja", ponuda.CenaUsloviPlacanja ?? "")
                , new FieldContent("DatumVazenja", ponuda.DatumVazenja.Date.ToShortDateString())
                , new FieldContent("DatumPonude", ponuda.DatumPonude.Date.ToShortDateString())
                //, new ListContent("PredmetPonude")
                //    .AddItem(
                //        new FieldContent("Ponuda", "Eric")
                //        )
                //    .AddItem(
                //        new FieldContent("Ponuda", "Bob")
                //        )
                ); ; ; ; ;
            valuesToFill.Lists.Add(new ListContent("PredmetPonude", ponuda.PredmetPonude.Select(x => new ListItemContent(new FieldContent("Ponuda", x.ObimPoslovanja.Naziv)))));
            var i = 0;
            valuesToFill.Tables.Add(new TableContent("Stavke", ponuda.Stavke.Select(s =>
            {
              i++;
              return new TableRowContent(new FieldContent("Rb", i.ToString())
                    , new FieldContent("Opis", s.OpisPosla ?? "")
                    , new FieldContent("Jm", s.Jm ?? "")
                    , new FieldContent("Cena", string.Format(CultureInfo.GetCultureInfo("de-DE"), "{0:n2}", s.Cena.ToString()))
                    , new FieldContent("Kolicina", string.Format(CultureInfo.GetCultureInfo("de-DE"), "{0:n2}", s.Kolicina.ToString()))
                    , new FieldContent("Vrednost", ponuda.Valuta == "EUR" ? string.Format(CultureInfo.GetCultureInfo("de-DE"), "{0:n2}", s.VrednostEur.ToString()) : string.Format(CultureInfo.GetCultureInfo("de-DE"), "{0:n2}", s.Vrednost.ToString()))
                    ); ;

            })));
            valuesToFill.Fields.Add(new FieldContent("Total", string.Format(CultureInfo.GetCultureInfo("de-DE"), "{0:n2}", ponuda.Vrednost.ToString())));
            valuesToFill.Fields.Add(new FieldContent("Valuta", ponuda.Valuta));
            outputDocument.FillContent(valuesToFill);
            outputDocument.SaveChanges();
            stream.Seek(0, SeekOrigin.Begin);
            var res = File(stream, "application/octet-stream", "PonudaStampa.docx"); // returns a FileStreamResult
            res.EnableRangeProcessing = true;
            return res;
          }
        }

      }
      catch (Exception ex)
      {

        _logger.LogError(ex.Message);
        return null;
      }


      //File.Delete("OutputDocument.docx");
      //File.Copy("InputTemplate.docx", "OutputDocument.docx");





    }

  }


}

