using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;

namespace BeveragePaymentApi.Beverages;

public class BeverageService : IBeverageService
{
    private readonly IBeverageRepository _beverageRepository;
    private readonly NotificationService _notificationService;

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
        var beverage = await _beverageRepository.GetById(id);

        if (beverage == null) throw new NotFoundException("Beverage was not found.");

        return beverage;
    }

    public async Task<Beverage> Create(Beverage beverage)
    {
        await _notificationService.SendBeverageCreatedNotificationAsync();
        return await _beverageRepository.Create(beverage);
    }

    public async Task<Beverage> Update(Beverage beverage)
    {
        var existingBeverage = await _beverageRepository.GetById(beverage.BeverageId);
        if (existingBeverage == null)
        {
            throw new NotFoundException("Beverage was not found.");
        }

        await _notificationService.SendBeverageUpdatedNotificationAsync();
        return await _beverageRepository.Update(beverage);
    }


    public async Task Delete(int id)
    {
        //Check if beverage exist
        await _beverageRepository.GetById(id);

        await _beverageRepository.Delete(id);

        await _notificationService.SendBeverageDeletedNotificationAsync();
    }

    public async Task<float> GetLatestPrice(int id)
    {
        var beverage = await _beverageRepository.GetById(id);

        if (beverage == null) throw new NotFoundException("Beverage was not found.");

        var latestPrice = beverage.Prices.OrderByDescending(p => p.Timestamp).FirstOrDefault();

        if (latestPrice == null) throw new NotFoundException("Price was not found.");

        return latestPrice.Amount;

    }
}

public interface IBeverageService
{
    public Task<IEnumerable<Beverage>> GetAllBeverages();
    public Task<Beverage?> GetById(int id);
    public Task<Beverage> Create(Beverage beverage);
    public Task<Beverage> Update(Beverage beverage);
    public Task Delete(int id);

    public Task<float> GetLatestPrice(int id);
}