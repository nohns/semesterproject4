using System.Reflection;
using Microsoft.OpenApi.Models;
using Asp.Versioning;
using BeveragePaymentApi.Beverages;
using BeveragePaymentApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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
        ApplicationDbContextSeed.SeedDataAsync(context).Wait(); // Call SeedDataAsync and wait for completion
    }
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
