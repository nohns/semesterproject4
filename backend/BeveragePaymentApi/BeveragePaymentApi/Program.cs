using System.Reflection;
using Microsoft.OpenApi.Models;
using Asp.Versioning;
using BeveragePaymentApi.Beverages;
using BeveragePaymentApi.Data;
using BeveragePaymentApi.Prices;
using Microsoft.EntityFrameworkCore;
using BeveragePaymentApi.Orders;

using Microsoft.AspNetCore.Authentication.Cookies;
using BeveragePaymentApi.Auth;
using Microsoft.AspNetCore.Antiforgery;
using BeveragePaymentApi;
using BeveragePaymentApi.Images;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:5175", "http://localhost:5174", "http://engine:80", "https://bartender.foobar.nohns.dk", "https://order.foobar.nohns.dk", "https://bartender.foobar.live.nohns.dk", "https://order.foobar.live.nohns.dk")
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
builder.Services.AddScoped<IPriceService, PriceService>();
builder.Services.AddScoped<IPriceRepository, PriceRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddHealthChecks().AddCheck<DatabaseSeededHealthCheck>("DatabaseSeeded");

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
app.MapHealthChecks("/health");

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
if (true)
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
        DatabaseSeededHealthCheck.MarkDatabaseAsSeeded();
    }
}
else
{
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
        DatabaseSeededHealthCheck.MarkDatabaseAsSeeded();
    }
}
//app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseCookiePolicy();
app.UseJwtCookieMiddleware(app.Services.GetRequiredService<IAntiforgery>(),
    System.Text.Encoding.ASCII.GetBytes(builder.Configuration["JwtSettings:Key"]!));

JwtCookieMiddleware.Initialize(builder.Configuration);

//Skal måske fjernes
//app.UseAntiforgeryCookieMiddleware(app.Services.GetRequiredService<IAntiforgery>());
//app.UseAntiforgery();


app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

app.Run();

