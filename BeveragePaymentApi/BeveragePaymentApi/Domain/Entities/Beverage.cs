using System.ComponentModel.DataAnnotations;

namespace BeveragePaymentApi.Domain;

public class Beverage
{
    [Key]
    public int BeverageId { get; set; }
    [MaxLength(100)]
    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? ImageSrc { get; set; }

    public double BasePrice { get; set; }

    public double MaxPrice { get; set; }

    public double MinPrice { get; set; }
    public double BuyMultiplier { get; set; }
    public string? HalfTime { get; set; }
    public bool IsActive { get; set; }
    public int TotalSales { get; set; }
    public List<Price>? Prices { get; set; }

}