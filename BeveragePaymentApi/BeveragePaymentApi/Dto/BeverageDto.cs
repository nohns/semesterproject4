

using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Entities;

namespace Dto;


public class BeverageDto
{
  public string? Name { get; set; }

  public string? Description { get; set; }

  public string? ImageSrc { get; set; }

  public double BasePrice { get; set; }

  public double MaxPrice { get; set; }

  public double MinPrice { get; set; }

  public bool IsActive { get; set; }
  public double BuyMultiplier { get; set; }
  public int HalfTime { get; set; }

  public Beverage ToBeverage()
  {
    return new Beverage
    {
      Name = this.Name,
      Description = this.Description,
      ImageSrc = this.ImageSrc,
      BasePrice = this.BasePrice,
      MaxPrice = this.MaxPrice,
      MinPrice = this.MinPrice,
      IsActive = this.IsActive,
      BuyMultiplier = this.BuyMultiplier,
      HalfTime = this.HalfTime
    };
  }

  public Beverage ToBeverage(Beverage beverage)
  {
    beverage.Name = this.Name;
    beverage.Description = this.Description;
    beverage.ImageSrc = this.ImageSrc;
    beverage.BasePrice = this.BasePrice;
    beverage.MinPrice = this.MinPrice;
    beverage.MaxPrice = this.MaxPrice;
    beverage.IsActive = this.IsActive;
    beverage.BuyMultiplier = this.BuyMultiplier;
    beverage.HalfTime = this.HalfTime;
    return beverage;
  }

}
