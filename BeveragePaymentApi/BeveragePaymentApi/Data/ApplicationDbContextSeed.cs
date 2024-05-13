using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Entities;
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
        if (!context.Users.Any())
        {
            await SeedBartenderUser(context);
        }
    }

    public static async Task SeedBartenderUser(ApplicationDbContext context)
    {
        var user = new User
        {
            Username = "bartender",
            Password = "bartender123",
        };

        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, 12);

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

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
