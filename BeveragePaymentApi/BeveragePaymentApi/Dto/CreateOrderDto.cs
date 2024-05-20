using BeveragePaymentApi.Domain.Entities;


namespace BeveragePaymentApi.Dto;

public class CreateOrderDto
{
    public DateTime Time { get; set; }
    public int PriceId { get; set; }
    
    public int BeverageId { get; set; }
    
    public int Quantity { get; set; }
    
    public int StripeIntentId { get; set; }
    
    
    public Order ToOrder()
    {
        return new Order
        {
            Time = this.Time,
            PriceId = this.PriceId,
            BeverageId = this.BeverageId,
            Quantity = this.Quantity,
            StripeIntentId = this.StripeIntentId,
        };
    }

    public Order ToOrder(Order order)
    {
        order.Time = this.Time;
        order.PriceId = this.PriceId;
        order.BeverageId = this.BeverageId;
        order.Quantity = this.Quantity;
        order.StripeIntentId = this.StripeIntentId;

        return order;
    }
    


}