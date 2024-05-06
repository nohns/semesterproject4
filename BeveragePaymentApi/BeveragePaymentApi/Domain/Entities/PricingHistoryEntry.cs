public class PricingHistoryEntry
{
    public int Id { get; set; }
    public int PricingHistoryId { get; set; }
    public PricingHistory PricingHistory { get; set; } = null!;
    public int Price { get; set; }
    public DateTime Timestamp { get; set;}
}