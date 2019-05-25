using NHibernate;
using System;
using System.Globalization;
using System.Linq;
using Tuv.Models;

namespace Tuv.Helper
{
  public static class Helper
  {
    public static int RedniBroj(ISession _session, string tip)
    {
      var query = _session.CreateSQLQuery("exec RedniBroj :tip");
      query.SetCacheMode(CacheMode.Ignore);
      query.SetParameter("tip", tip);
      //query.SetResultTransformer(new AliasToBeanResultTransformer(typeof(int)));
      var result = query.UniqueResult<int>();
      return result;
    }

    public static string Jezik(ISession _session, string username)
    {
      var upit = _session.QueryOver<Korisnik>().Where(x => x.KorisnickoIme == username);
      var korisnik = upit.List<Korisnik>().SingleOrDefault();
      var jezik = korisnik?.Lang ?? "sr";
      return jezik;
    }

    // This presumes that weeks start with Monday.
    // Week 1 is the 1st week of the year with a Thursday in it.
    public static int GetIso8601WeekOfYear(DateTime time)
    {
      // Seriously cheat.  If its Monday, Tuesday or Wednesday, then it'll 
      // be the same week# as whatever Thursday, Friday or Saturday are,
      // and we always get those right
      DayOfWeek day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
      if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
      {
        time = time.AddDays(3);
      }

      // Return the week of our adjusted day
      return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
    }
  }
}
