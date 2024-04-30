using BeveragePaymentApi.Domain;

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
                UpperBoundary = 20,
                LowerBoundary = 10,
                BaseValue = 15
            },
            new Beverage
            {
                Name = "Sodavand",
                UpperBoundary = 25,
                LowerBoundary = 15,
                BaseValue = 20
            }
        };

        await context.Beverages.AddRangeAsync(beverages);
        await context.SaveChangesAsync();
    }
}