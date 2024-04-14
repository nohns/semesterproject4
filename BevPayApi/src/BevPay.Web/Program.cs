using BevPay.Core.Interfaces;
using BevPay.Core.Services;
using BevPay.Infrastructure.Data;
using BevPay.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<BarContext>();
builder.Services.AddScoped<IBeverageRepository, BeverageRepository>();
builder.Services.AddScoped<BeverageService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();

