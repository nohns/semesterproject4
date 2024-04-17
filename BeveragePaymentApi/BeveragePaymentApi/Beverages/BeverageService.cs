using BeveragePaymentApi.Domain;

namespace BeveragePaymentApi.Beverages;

public class BeverageService : IBeverageService
{
    private readonly IBeverageRepository _beverageRepository;

    public BeverageService(IBeverageRepository beverageRepository)
    {
        _beverageRepository = beverageRepository;
    }

    public async Task<IEnumerable<Beverage>> GetAllBeverages()
    {
        return await _beverageRepository.GetAll();
    }

    public async Task<Beverage?> GetById(int id)
    {
        return await _beverageRepository.GetById(id);
    }

    public async Task<Beverage> Create(Beverage beverage)
    {
        return await _beverageRepository.Create(beverage);
    }

    public async Task<Beverage> Update(Beverage beverage)
    {
        return await _beverageRepository.Update(beverage);
    }

    public async Task Delete(int id)
    {
        await _beverageRepository.Delete(id);
    }
}

public interface IBeverageService
{
    public Task<IEnumerable<Beverage>> GetAllBeverages();
    public Task<Beverage?> GetById(int id);
    public Task<Beverage> Create(Beverage beverage);
    public Task<Beverage> Update(Beverage beverage);
    public Task Delete(int id);
}