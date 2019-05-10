using NHibernate;
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
    }
}
