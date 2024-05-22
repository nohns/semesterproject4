using BeveragePaymentApi.Domain.Entities;


namespace BeveragePaymentApi.Dto;

public class CreateOrderDto
{
    public int PriceId { get; set; }
    public int BeverageId { get; set; }
    public int Quantity { get; set; }

    public Order ToOrder()
    {
        var order = new Order();
        return ToOrder(order);
    }

    public Order ToOrder(Order order)
    {
        order.PriceId = this.PriceId;
        order.BeverageId = this.BeverageId;
        order.Quantity = this.Quantity;

        return order;
    }
}
