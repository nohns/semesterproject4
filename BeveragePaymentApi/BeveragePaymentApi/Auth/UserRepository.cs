

using BeveragePaymentApi.Data;
using BeveragePaymentApi.Dto;
using BCrypt.Net;

namespace BeveragePaymentApi.Auth;

public class UserRepository
{
    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    private readonly ApplicationDbContext _context;

    public void CreateUser()
    {
        // Create user
    }
    public int FindUser(LoginDto login)
    {
        return 1;
        // Find user
    }

    public string SaltPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, 12); //Work factor of 12
    }

    public void VerifyPassword(string password, string hashedPassword)
    {
        var result = BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }

    public void GenerateToken()
    {
        // Generate token
    }
}