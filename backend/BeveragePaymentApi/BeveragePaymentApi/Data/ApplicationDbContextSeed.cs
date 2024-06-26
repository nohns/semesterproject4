using BeveragePaymentApi.Domain.Entities;

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
            Description = "Det blåeste vand du nogensinde har set",
            ImageSrc = "https://ik.imagekit.io/imageAPI/Hotpot1_i1X_NpAwj.png?updatedAt=1716194377675",
            BasePrice = 10,
            MaxPrice = 15,
            MinPrice = 5,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.5,
            HalfTime = 120,
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
            Description = "Mere rødt end hindbærbrus",
            ImageSrc = "https://ik.imagekit.io/imageAPI/Hotpot2_BGjM11gdy.png?updatedAt=1716194395073",
            BasePrice = 10,
            MaxPrice = 15,
            MinPrice = 5,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.5,
            HalfTime = 120,
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
            Description = "Mere forfriskende end en græsplæne",
            ImageSrc = "https://ik.imagekit.io/imageAPI/Hotpot3_QGbQ6WIPN.png?updatedAt=1716194407989",
            BasePrice = 12,
            MaxPrice = 18,
            MinPrice = 6,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.025,
            HalfTime = 120,
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
            Description = "Ikke så gult som du tror",
            ImageSrc = "https://ik.imagekit.io/imageAPI/image_W-xPJxvZq.png?updatedAt=1716196564945",
            BasePrice = 8,
            MaxPrice = 12,
            MinPrice = 4,
            IsActive = false,
            TotalSales = 0,
            BuyMultiplier = 1.025,
            HalfTime = 120,
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
            Name = "Fidel Castro",
            Description = "Lys rom, Ginger Beer & Limeskive (delishhh)",
            ImageSrc = "https://ik.imagekit.io/imageAPI/image_W-xPJxvZq.png?updatedAt=1716196564945",
            BasePrice = 30,
            MaxPrice = 45,
            MinPrice = 15,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.025,
            HalfTime = 120,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 30,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Gin Hass",
            Description = "Sirlig blanding af gin og hass (okay det er gin, lemonsodavand og mangosirup)",
            ImageSrc = "https://ik.imagekit.io/imageAPI/image(1)_6eU52S2gN.png?updatedAt=1716197480026",
            BasePrice = 30,
            MaxPrice = 45,
            MinPrice = 15,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.025,
            HalfTime = 120,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 30,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Jägerbomb",
            Description = "Shotsglas med jägermeister sættes elegant ned i et glas med Red Bull",
            ImageSrc = "https://ik.imagekit.io/imageAPI/image_u6X-VqmVQ.png?updatedAt=1716197357406",
            BasePrice = 25,
            MaxPrice = 40,
            MinPrice = 15,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.025,
            HalfTime = 120,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 25,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Kung Fu",
            Description = "Pisang Ambon, Pepsi & Jägermeister (mums!)",
            ImageSrc = "https://ik.imagekit.io/imageAPI/image(1)_wotNIvB_W.png?updatedAt=1716208034973",
            BasePrice = 30,
            MaxPrice = 45,
            MinPrice = 15,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.025,
            HalfTime = 120,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 30,
                    Timestamp = DateTime.Now
                }
            }
        },
         new Beverage
        {
            Name = "Ceres Top",
            Description = "Det bar' øl",
            ImageSrc = "https://ik.imagekit.io/imageAPI/image_EjtqaJsot.png?updatedAt=1716196012768",
            BasePrice = 14,
            MaxPrice = 20,
            MinPrice = 9,
            IsActive = true,
            TotalSales = 0,
            BuyMultiplier = 1.025,
            HalfTime = 120,
            Prices = new List<Price>
            {
                new Price
                {
                    Amount = 14,
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
