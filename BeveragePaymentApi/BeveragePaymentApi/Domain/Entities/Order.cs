using System.ComponentModel.DataAnnotations;

namespace BeveragePaymentApi.Domain.Entities;


public class Order 
{
    [Key]
    public int OrderId { get; set; }
    public int BeverageId { get; set; }
    
    public Price? Price { get; set; }
    
    public int? PriceId { get; set; } 
    public int ?StripeIntentId { get; set; }
    //nullable indtil vi ved hvordan stripe virker
    public int Quantity { get; set; }
    public DateTime? Time { get; set; }

    enum Status 
    {
        Pending,
        Processing,
        Fulfilled
    }

}