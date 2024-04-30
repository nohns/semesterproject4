using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace BeveragePaymentApi.Data;

public class ApplicationDbContext : IdentityDbContext<ApiUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {
        
    }

    public DbSet<Beverage> Beverages => Set<Beverage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Beverage>()
            .Property(b => b.Id)
            .ValueGeneratedOnAdd();

        base.OnModelCreating(modelBuilder);
        
    }
}