using System.ComponentModel.DataAnnotations;

namespace BeveragePaymentApi.Domain;

public class Beverage
{
    [Key]
    public int Id { get; set; }
    [MaxLength(100)]
    public string? Name { get; set; }
    public int UpperBoundary { get; set; }
    public int LowerBoundary { get; set; }
    public int BaseValue { get; set; }
}