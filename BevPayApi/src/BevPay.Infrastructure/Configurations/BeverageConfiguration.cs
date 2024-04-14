using BevPay.Core.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BevPay.Infrastructure.Configurations;

public class BeverageConfiguration : IEntityTypeConfiguration<Beverage>
{
    public void Configure(EntityTypeBuilder<Beverage> builder)
    {
        builder.ToTable("Beverage");
        SeedData(builder);
    }

    public static void SeedData(EntityTypeBuilder<Beverage> builder)
    {
        builder.HasData
        (
            new Beverage { Id = 1, Name = "Blå Vand" },
            new Beverage { Id = 2, Name = "Spejlæg" },
            new Beverage { Id = 3, Name = "Øl" }
        );
    }
}