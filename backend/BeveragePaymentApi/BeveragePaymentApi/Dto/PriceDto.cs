namespace BeveragePaymentApi.Dto
{
    public class PriceDto
    {
        public int Id { get; set; }
        public int BeverageId { get; set; }
        public float Amount { get; set; }
        public DateTime Timestamp { get; set; }
    }
}