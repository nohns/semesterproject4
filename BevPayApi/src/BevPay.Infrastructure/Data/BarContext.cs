using Microsoft.EntityFrameworkCore;
using BevPay.Core.Models;

namespace BevPay.Infrastructure.Data;

public class BarContext : DbContext
{
    
    public DbSet<Beverage> Beverage { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySQL("Server=localhost;Port=3306;Database=FooBarDb;Pwd=SuperSecretPassword123;");
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Beverage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
        });
    }
    
}
