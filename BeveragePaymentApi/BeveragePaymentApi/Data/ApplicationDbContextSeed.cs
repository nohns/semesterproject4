using BeveragePaymentApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace BeveragePaymentApi.Data;

public static class ApplicationDbContextSeed
{
    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        if (!context.Beverages.Any())
        {
            await SeedBeveragesAsync(context);
        }
    }

    private static async Task SeedBeveragesAsync(ApplicationDbContext context)
    {
        var beverages = new[]
        {
            new Beverage
            {
                Name = "Blå vand",
                Description = "En flaske blå vand",
                ImageSrc = "https://via.placeholder.com/150",
                BasePrice = 10,
                MaxPrice = 15,
                MinPrice = 5,
                PricingHistory = new PricingHistory
                {
                    PricingHistoryEntries = new List<PricingHistoryEntry>
                    {
                        new PricingHistoryEntry
                        {
                            Price = 10, Timestamp = DateTime.Now
                        }
                    }
                }
            },
            new Beverage
            {
                Name = "Rød vand",
                Description = "En flaske rød vand",
                ImageSrc = "https://via.placeholder.com/150",
                BasePrice = 10,
                MaxPrice = 15,
                MinPrice = 5,
                PricingHistory = new PricingHistory
                {
                    PricingHistoryEntries = new List<PricingHistoryEntry>
                    {
                        new PricingHistoryEntry
                        {
                            Price = 10, Timestamp = DateTime.Now
                        }
                    }
                }
            },
        };

        await context.Beverages.AddRangeAsync(beverages);
        await context.SaveChangesAsync();
    }
}
