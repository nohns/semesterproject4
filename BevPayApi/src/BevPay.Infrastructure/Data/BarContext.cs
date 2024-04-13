using Microsoft.EntityFrameworkCore;
using BevPay.Core.Model;
using BevPay.Infrastructure.Configurations;

namespace BevPay.Infrastructure.Data;

public class BarContext : DbContext
{
    
    public DbSet<Beverage> Beverages { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySQL("Server=localhost;Port=3306;Database=FooBarDb;Uid=root;Pwd=SuperSecretPassword123;");
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new BeverageConfiguration());
    }
}
