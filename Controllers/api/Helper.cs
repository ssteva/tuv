using NHibernate;
using NHibernate.Transform;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tuv.Controllers.api
{
  public static class Helper
  {
    public static int RedniBroj(ISession _session, string tip, DateTime datum)
    {
      var query = _session.CreateSQLQuery("exec RedniBroj :tip, :datum");
      query.SetCacheMode(CacheMode.Ignore);
      query.SetParameter("tip", tip);
      query.SetParameter("datum", datum);
      //query.SetResultTransformer(new AliasToBeanResultTransformer(typeof(int)));
      var result = query.UniqueResult<int>();
      return result;
    }
  }
}
