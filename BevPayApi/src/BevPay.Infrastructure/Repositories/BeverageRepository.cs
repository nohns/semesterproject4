using BevPay.Core.Interfaces;
using BevPay.Core.Model;
using BevPay.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BevPay.Infrastructure.Repositories;

public class BeverageRepository : Repository, IBeverageRepository
{
    public BeverageRepository(BarContext context) : base(context) {}

    public async Task<List<Beverage>> GetBeverages()
    {
        return await Context.Beverages.ToListAsync();
    }
}