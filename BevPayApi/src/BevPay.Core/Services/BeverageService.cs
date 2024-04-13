
using BevPay.Core.Interfaces;
using BevPay.Core.Model;

namespace BevPay.Core.Services;

public class BeverageService
{
    private readonly IBeverageRepository _beverageRepository;

    public BeverageService(IBeverageRepository beverageRepository)
    {
        _beverageRepository = beverageRepository;
    }
    
    public async Task<List<Beverage>> GetBeverages()
    {
        var beverages = await _beverageRepository.GetBeverages();
        return beverages;
    }
    
}