using System.ComponentModel.DataAnnotations;

namespace BeveragePaymentApi.Domain.Entities;

public enum Status
{
    Pending,
    Processing,
    Fulfilled
}

public class Order
{
    [Key]
    public int OrderId { get; set; }
    public int BeverageId { get; set; }

    public Price? Price { get; set; }

    public int? PriceId { get; set; }
    public string StripeIntentId { get; set; }
    public string StripeClientSecret { get; set; }

    //nullable indtil vi ved hvordan stripe virker
    public int Quantity { get; set; }
    public DateTime? Time { get; set; }
    public DateTime Expiry { get; set; }

    public Status Status = Status.Pending;
}
