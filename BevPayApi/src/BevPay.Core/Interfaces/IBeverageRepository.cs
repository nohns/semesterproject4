using BevPay.Core.Model;

namespace BevPay.Core.Interfaces;

public interface IBeverageRepository : IRepository<Beverage>
{
    public Task<List<Beverage>> GetBeverages();
}