using BeveragePaymentApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace BeveragePaymentApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {
        
    }

    public DbSet<Beverage> Beverages => Set<Beverage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Beverage>()
            .Property(b => b.BeverageId)
            .ValueGeneratedOnAdd();

        base.OnModelCreating(modelBuilder);
        
    }
}