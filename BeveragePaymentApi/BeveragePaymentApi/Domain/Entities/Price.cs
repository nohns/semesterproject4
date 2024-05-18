using System.ComponentModel.DataAnnotations;

namespace BeveragePaymentApi.Domain.Entities;

public class Price
{
    [Key]
    public int Id { get; set; }
    public int BeverageId { get; set; }
    public float Amount { get; set; }
    public DateTime Timestamp { get; set; }

    public Beverage Beverage { get; set; }
    
    public Order? Order { get; set; }
    
   
}