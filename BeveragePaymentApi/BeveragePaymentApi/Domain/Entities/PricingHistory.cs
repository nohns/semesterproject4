using BeveragePaymentApi.Domain;

public class PricingHistory
{
    public int Id { get; set; }
    public int BeverageId { get; set; }
    public Beverage Beverage { get; set; } = null!;
    public ICollection<PricingHistoryEntry> PricingHistoryEntries { get; set; } = new List<PricingHistoryEntry>();
}