using BeveragePaymentApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeveragePaymentApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {

    }

    public DbSet<Beverage> Beverages => Set<Beverage>();
    public DbSet<Price> Prices => Set<Price>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Beverage>()
            .Property(b => b.BeverageId)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<User>()
            .Property(u => u.UserId)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Order>()
            .HasOne(p => p.Price)
            .WithOne(o => o.Order)
            .HasForeignKey<Order>(o => o.PriceId);

        modelBuilder.Entity<Price>()
            .HasOne(p => p.Beverage)
            .WithMany(b => b.Prices)
            .HasForeignKey(p => p.BeverageId);
            
        base.OnModelCreating(modelBuilder);

    }
}