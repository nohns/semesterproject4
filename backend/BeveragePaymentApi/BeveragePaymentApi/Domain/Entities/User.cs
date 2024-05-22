
using System.ComponentModel.DataAnnotations;

namespace BeveragePaymentApi.Domain.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}