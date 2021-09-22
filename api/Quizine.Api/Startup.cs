using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Quizine.Api.Helpers;
using Quizine.Api.Hubs;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using Quizine.Api.Services;
using System;
using System.Text.Json.Serialization;

namespace Quizine.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers()
                .ConfigureApiBehaviorOptions(opt =>
                {
                    opt.InvalidModelStateResponseFactory = context =>
                    {
                        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Startup>>();
                        LogHelper.LogModelStateErrors(logger, context.ModelState, context.ActionDescriptor.DisplayName);
                        return new BadRequestObjectResult(context.ModelState);
                    };
                })
                .AddJsonOptions(opt =>
                {
                    opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });
            services.AddCors();
            services.AddSignalR(opt =>
            {
                opt.ClientTimeoutInterval = TimeSpan.FromMinutes(3);
            });
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(opt =>
                {
                    opt.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
                });
            services.AddSingleton<ISessionRepository, SessionRepository>();
            services.AddSingleton<ITriviaRespository, TriviaRepository>();
            services.AddSingleton<IResourceManagerParameters, ResourceManagerParameters>();
            services.AddSingleton<IUserIdentityMapper<string>, UserIdentityMapper<string>>();
            services.AddHttpClient<ITriviaRespository, TriviaRepository>();
            services.AddHostedService<ResourceManagerService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(policy =>
            {
                policy
                .WithOrigins("https://quizine-app.web.app", "http://localhost:3000")
                .AllowAnyMethod()
                .AllowCredentials()
                .AllowAnyHeader();
            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHttpsRedirection();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<QuizHub>("/hubs/quiz");
            });
        }
    }
}
