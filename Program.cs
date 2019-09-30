﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.FileExtensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NHibernate;
using Serilog;
using Serilog.Events;
using Tuv.Helper;

namespace Tuv
{
  public class Program
  {
    public static IConfigurationRoot Configuration { get; set; }
    public static void Main(string[] args)
    {
      var builder = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json");
      Configuration = builder.Build();
      Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Debug()
        .Destructure
          .ByTransforming<SqlParameter>(r => new { r.ParameterName, r.Value })
        .MinimumLevel.Override("Microsoft", LogEventLevel.Debug)
        .Enrich.FromLogContext()
        //.WriteTo.MSSqlServer(Configuration.GetConnectionString("DefaultConnection"), "Logs")
        .WriteTo.RollingFile("logs\\log-{Date}.txt")
        .CreateLogger();
      try
      {
        Log.Information("Starting web host {0}", 1);
        var host = CreateWebHostBuilder(args).Build();
        using (var scope = host.Services.CreateScope())
        {
          var services = scope.ServiceProvider;

          using (var serviceScope = host.Services.CreateScope())
          {
            try
            {
              //EnsureDataStorageIsReady(services);
              var _config = serviceScope.ServiceProvider.GetService<IConfiguration>();
              var s = _config.GetSection("Konfiguracija:seed");
              var seed = Boolean.Parse(s.Value);
              if (seed)
              {
                var init = new Seed(serviceScope.ServiceProvider.GetService<KorisnikManager>(), serviceScope.ServiceProvider.GetService<ISession>(), serviceScope.ServiceProvider.GetService<Microsoft.Extensions.Logging.ILoggerFactory>()
                      , serviceScope.ServiceProvider.GetService<IHostingEnvironment>());
                init.SeedDatabase();
              }
            }
            catch (Exception ex)
            {
              var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<Program>>();
              logger.LogError(ex.Message, "An error occurred while migrating the database.");
            }

          }

        }
        host.Run();
        return;
      }
      catch (Exception ex)
      {
        Log.Fatal(ex, "Host terminated unexpectedly");
        return;
      }
      finally
      {
        Log.CloseAndFlush();
      }
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseSerilog()
            .UseStartup<Startup>();
  }
}
