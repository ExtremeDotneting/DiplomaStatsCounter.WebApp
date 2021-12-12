using System.IO;
using IRO.Mvc.Core;
using IRO.Mvc.MvcExceptionHandler;
using IROFramework.Core.AppEnvironment;
using IROFramework.Core.StartupInit;
using IROFramework.Web.StartupInit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using TEMPLATE_APP.WebApp.Services;

namespace TEMPLATE_APP
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env.Init(new ConfigurationsEnvLoader(configuration));
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            #region Template.
            services.AddBasis();
            services.AddControllers()
                .AddNewtonsoftJson(opt =>
                {
                    //var contractResolver = new DefaultContractResolver
                    //{
                    //    NamingStrategy = new SnakeCaseNamingStrategy()
                    //};
                    //opt.SerializerSettings.ContractResolver = contractResolver;
                });

            //Increase file upload size.
            services.ConfigureFormMaxUploadSize();

            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));

            services.AddSwaggerGen_Local();

            services.AddMvcExceptionHandler();

            //Add key value storage, type choosen by config.
            services.AddMyStorage();

            //Abstract DB Init. For development use just key-value storage as database.
            services.AddMyAbstractDatabase();

            services.AddTelegramFilesCloud();

            services.AddMyLogging();

            //services.AddEmailService();

            services.AddMyAuth();
            #endregion

            services.AddSingleton<GithubStatsCounterService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            #region Template.
            //Base base part.
            LogInitExtensions.InitMyLogging(app);
            app.UseCookieAuthToken();
            app.UseAuthentication();
            app.IncreaseMaxFileUploadSize();
            app.UseCors("CorsPolicy");
            if (Env.IsDebug)
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHttpsRedirection();
            }

            //Common part.
            app.UseExceptionBinder_Local(Env.IsDebug);
            if (Env.IsDebug)
            {
                app.UseMiddleware<RewindHttpStreamsMiddleware>();
                app.UseAllRequestsLogging("requestsLogs");
            }
            app.UseSwaggerUI_Local();

            //Current app part.
            //app.UseMyLiteDatabase();
            //app.UseAlwaysRedirectIfNotLogin();
            app.UseIndexHtmlRedirect();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(env.ContentRootPath, "FrontApp")
                    ),
                RequestPath = ""
            });

            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            #endregion
        }

    }
}
