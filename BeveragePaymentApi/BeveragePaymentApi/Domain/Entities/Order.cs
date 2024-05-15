namespace BeveragePaymentApi.Domain.Entities;


public class Order 
{
    public int OrderId { get; set; }
    
    public Price? Price { get; set; }
    
    public int? PriceId { get; set; } 
    public int ?StripeIntentId { get; set; }
    //nullable indtil vi ved hvordan stripe virker
    public DateTime? TimeStamp { get; set; }
    public DateTime? ExpiryTime { get; set; }

    enum States 
    {
        Pending,
        Processing,
        Fulfilled
    }
}