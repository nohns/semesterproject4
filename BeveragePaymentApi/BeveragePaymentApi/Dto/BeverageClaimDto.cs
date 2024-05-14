

namespace BeveragePaymentApi.Dto
{
    public class BeverageClaimDto
    {
        public string BeverageId { get; set; }
        public double BeveragePrice { get; set; }

        public DateTime ClaimTime { get; set; }

        public DateTime ExperationTime { get; set; }
    }
}