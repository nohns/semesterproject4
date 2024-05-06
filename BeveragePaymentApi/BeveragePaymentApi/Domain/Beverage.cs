using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace BeveragePaymentApi.Domain;

public class Beverage
{
    [Key]
    public int BeverageId { get; set; }
    [MaxLength(100)]
    public string? Name { get; set; }

    public string? Description { get; set; }
    public string? ImageSrc { get; set; }
    public double MaxPrice { get; set; }
    public double MinPrice { get; set; }
    public double BasePrice { get; set; }
}