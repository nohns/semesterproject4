using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;
using Dto;
using Newtonsoft.Json;

namespace BeveragePaymentApi.Beverages;

public class BeverageService : IBeverageService
{
  private readonly IBeverageRepository _beverageRepository;
  private readonly NotificationService _notificationService;

  public BeverageService(IBeverageRepository beverageRepository, NotificationService notificationService)
  {
    _beverageRepository = beverageRepository;
    _notificationService = notificationService;
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

  public async Task<Beverage> Create(BeverageDto dto)
  {
    ValidatePrice(dto);

    var newBeverage = dto.ToBeverage();

    var beverageResult = await _beverageRepository.Create(newBeverage);
    await _notificationService.SendBeverageAddedNotificationAsync(beverageResult);
    return beverageResult;
  }

  public async Task<Beverage> Update(int id, BeverageDto dto)
  {
      var existingBeverage = await _beverageRepository.GetById(id);
      if (existingBeverage == null)
      {
          throw new NotFoundException("Beverage was not found.");
      }

      ValidatePrice(dto);

      existingBeverage = dto.ToBeverage(existingBeverage);

      var updatedBeverage = await _beverageRepository.Update(existingBeverage);
      await _notificationService.SendBeverageUpdatedNotificationAsync(updatedBeverage);

      return updatedBeverage;
  }




  public async Task Delete(int id)
  {
    //Check if beverage exis
    var beverage = await _beverageRepository.GetById(id);
    if (beverage == null) throw new NotFoundException("Beverage was not found.");
    await _beverageRepository.Delete(id);

    await _notificationService.SendBeverageRemovedNotificationAsync(beverage);
  }

  public async Task<float> GetLatestPrice(int id)
  {
    var beverage = await _beverageRepository.GetById(id);

    if (beverage == null) throw new NotFoundException("Beverage was not found.");

    var latestPrice = beverage.Prices.OrderByDescending(p => p.Timestamp).FirstOrDefault();

    if (latestPrice == null) throw new NotFoundException("Price was not found.");

    return latestPrice.Amount;

  }

  private void ValidatePrice(BeverageDto dto)
  {
    if (dto.MinPrice > dto.BasePrice) throw new ValidationException("Min price cannot be higher than base price.");
    if (dto.MaxPrice < dto.BasePrice) throw new ValidationException("Max price cannot be lower than base price.");
    if (dto.MinPrice > dto.MaxPrice) throw new ValidationException("Min price cannot be higher than max price.");
  }

}

public interface IBeverageService
{
  public Task<IEnumerable<Beverage>> GetAllBeverages();
  public Task<Beverage?> GetById(int id);
  public Task<Beverage> Create(BeverageDto beverage);
  public Task<Beverage> Update(int id, BeverageDto beverage);
  public Task Delete(int id);

  public Task<float> GetLatestPrice(int id);
}
