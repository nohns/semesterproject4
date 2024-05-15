using Dto;

namespace BeveragePaymentApi.Dto;

public class CreateOrderDto
{
    public int OrderId { get; set; }
    public int BeverageId { get; set; }
    public DateTime Time { get; set; }
    public DateTime ExpiryTime { get; set; }
    public int PriceId { get; set; }
    
    public int AmountToBuy { get; set; }
}