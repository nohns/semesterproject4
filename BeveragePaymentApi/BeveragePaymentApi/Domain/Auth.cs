

using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Identity;


namespace BeveragePaymentApi.Domain
{
    public class ApiUser : IdentityUser
    {
        [MaxLength(100)]
        public string? FullName { get; set; }
    }
}