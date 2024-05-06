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
    public DbSet<PricingHistory> PricingHistories => Set<PricingHistory>();
    public DbSet<PricingHistoryEntry> PricingHistoryEntries => Set<PricingHistoryEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Beverage>()
            .Property(b => b.BeverageId)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<Beverage>()
            .HasOne(b => b.PricingHistory)
            .WithOne(ph => ph.Beverage)
            .HasForeignKey<PricingHistory>(ph => ph.BeverageId)
            .IsRequired();

        modelBuilder.Entity<PricingHistory>()
            .HasMany(p => p.PricingHistoryEntries)
            .WithOne(p => p.PricingHistory)
            .HasForeignKey(p => p.PricingHistoryId)
            .IsRequired();

        base.OnModelCreating(modelBuilder);
        
    }
}