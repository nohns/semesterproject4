using BeveragePaymentApi.Data;
using Microsoft.EntityFrameworkCore;
using BeveragePaymentApi.Domain.Entities;

namespace BeveragePaymentApi.Auth;

public class UserRepository : IUserRepository
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
    public async Task<User?> GetuserByUserName(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

    }
}


public interface IUserRepository
{
    public Task<User?> GetuserByUserName(string username);
}
