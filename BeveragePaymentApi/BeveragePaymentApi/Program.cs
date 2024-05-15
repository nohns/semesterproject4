using System.Reflection;
using Microsoft.OpenApi.Models;
using Asp.Versioning;
using BeveragePaymentApi.Beverages;
using BeveragePaymentApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using BeveragePaymentApi.Domain;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.Cookies;
using BeveragePaymentApi.Auth;
using System.Net;
using Microsoft.AspNetCore.Antiforgery;
using BeveragePaymentApi;
using BeveragePaymentApi.Images;
using System.Drawing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:5175")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition"));
});

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddControllersWithViews();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddApiVersioning(options =>
    {
        options.ApiVersionReader = new UrlSegmentApiVersionReader();
        options.AssumeDefaultVersionWhenUnspecified = true;
        options.DefaultApiVersion = new ApiVersion(1, 0);
    })
    .AddMvc()
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BeveragePaymentApi",
        Version = "v1.0",
        Description = "Beverage and Payment API of FooBar"
    });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddDbContext<ApplicationDbContext>(o =>
    o.UseMySQL(builder.Configuration.GetConnectionString("Database")!));

builder.Services.AddScoped<IBeverageService, BeverageService>();
builder.Services.AddScoped<IBeverageRepository, BeverageRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IImageApiService, ImageApiService>();
builder.Services.AddScoped<NotificationService>();


builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/v1/auth/login";
    options.AccessDeniedPath = "/v1/auth/accessdenied";
});
/*
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN";
    options.Cookie = new CookieBuilder()
    {
        Name = "XSRF"
    };
});*/

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
    options.Secure = CookieSecurePolicy.Always;
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint($"/swagger/v1/swagger.json", $"BeveragePaymentApi v1");
    });

    using (var scope = app.Services.CreateScope()) // Create a scope to resolve dependencies
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        try
        {
            if (context.Database.CanConnect())
            {

                context.Database.Migrate();
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        ApplicationDbContextSeed.SeedDataAsync(context).Wait(); // Call SeedDataAsync and wait for completion
    }
}
app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseCookiePolicy();
app.UseJwtCookieMiddleware(app.Services.GetRequiredService<IAntiforgery>(),
    System.Text.Encoding.ASCII.GetBytes(Constants.JwtTokenKey));


//Skal måske fjernes
//app.UseAntiforgeryCookieMiddleware(app.Services.GetRequiredService<IAntiforgery>());
//app.UseAntiforgery();


app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

app.Run();

