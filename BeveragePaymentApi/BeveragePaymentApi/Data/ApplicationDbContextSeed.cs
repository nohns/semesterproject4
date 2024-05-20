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
            ImageSrc = "https://ik.imagekit.io/imageAPI/Hotpot1_i1X_NpAwj.png?updatedAt=1716194377675",
            BasePrice = 10,
            MaxPrice = 15,
            MinPrice = 5,
            IsActive = true,
            TotalSales = 20,
            BuyMultiplier = 1.5,
            HalfTime = 1000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 10,
                    Timestamp = DateTime.Now
                }
            }
        },
        new Beverage
        {
            Name = "Rød vand",
            Description = "En flaske rød vand",
            ImageSrc = "https://ik.imagekit.io/imageAPI/Hotpot2_BGjM11gdy.png?updatedAt=1716194395073",
            BasePrice = 10,
            MaxPrice = 15,
            MinPrice = 5,
            IsActive = true,
            TotalSales = 15,
            BuyMultiplier = 1.5,
            HalfTime = 2000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 10,
                    Timestamp = DateTime.Now
                }
            }
        },

        new Beverage
        {
            Name = "Grøn vand",
            Description = "Refreshing green water",
            ImageSrc = "https://ik.imagekit.io/imageAPI/Hotpot3_QGbQ6WIPN.png?updatedAt=1716194407989",
            BasePrice = 12,
            MaxPrice = 18,
            MinPrice = 6,
            IsActive = true,
            TotalSales = 25,
            BuyMultiplier = 1.5,
            HalfTime = 3000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 12,
                    Timestamp = DateTime.Now
                }
            }
        },
        new Beverage
        {
            Name = "Gul vand",
            Description = "Invigorating yellow water",
            ImageSrc = "https://via.placeholder.com/150",
            BasePrice = 8,
            MaxPrice = 12,
            MinPrice = 4,
            IsActive = false,
            TotalSales = 5,
            BuyMultiplier = 1.5,
            HalfTime = 4000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 8,
                    Timestamp = DateTime.Now
                }
            }
        },
        new Beverage
        {
            Name = "Sort vand",
            Description = "Exotic black water",
            ImageSrc = "https://via.placeholder.com/150",
            BasePrice = 15,
            MaxPrice = 20,
            MinPrice = 10,
            IsActive = true,
            TotalSales = 30,
            BuyMultiplier = 1.5,
            HalfTime = 5000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 15,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Øl",
            Description = "Exotic black water",
            ImageSrc = "https://via.placeholder.com/150",
            BasePrice = 15,
            MaxPrice = 20,
            MinPrice = 10,
            IsActive = true,
            TotalSales = 30,
            BuyMultiplier = 1.5,
            HalfTime = 5000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 15,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Sort vand",
            Description = "Exotic black water",
            ImageSrc = "https://via.placeholder.com/150",
            BasePrice = 15,
            MaxPrice = 20,
            MinPrice = 10,
            IsActive = true,
            TotalSales = 30,
            BuyMultiplier = 1.5,
            HalfTime = 5000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 15,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Sort vand",
            Description = "Exotic black water",
            ImageSrc = "https://via.placeholder.com/150",
            BasePrice = 15,
            MaxPrice = 20,
            MinPrice = 10,
            IsActive = true,
            TotalSales = 30,
            BuyMultiplier = 1.5,
            HalfTime = 5000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 15,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Sort vand",
            Description = "Exotic black water",
            ImageSrc = "https://via.placeholder.com/150",
            BasePrice = 15,
            MaxPrice = 20,
            MinPrice = 10,
            IsActive = true,
            TotalSales = 30,
            BuyMultiplier = 1.5,
            HalfTime = 5000,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 15,
                    Timestamp = DateTime.Now
                }
            }
        }

    };

        if (!context.Beverages.Any())
        {
            await context.Beverages.AddRangeAsync(beverages);
            await context.SaveChangesAsync();
        }
    }

}
