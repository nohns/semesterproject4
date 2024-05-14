
namespace BeveragePaymentApi.Domain.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}