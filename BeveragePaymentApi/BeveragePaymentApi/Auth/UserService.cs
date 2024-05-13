

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Domain.Exceptions;
using BeveragePaymentApi.Dto;
using Microsoft.IdentityModel.Tokens;

namespace BeveragePaymentApi.Auth;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public string SaltPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, 12); //Work factor of 12
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
    public async Task<User> Login(LoginDto input)
    {
        var user = await _userRepository.GetuserByUserName(input.Username);

        if (user == null) throw new NotFoundException("User was not found.");

        bool correctPassword = VerifyPassword(input.Password, user.Password);

        if (!correctPassword) throw new WrongPasswordException("Password was not correct.");

        return user;
    }

    public ClaimsIdentity GenerateClaimsIdentity(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
        };

        return new ClaimsIdentity(claims, "Bearer");
    }

    public JwtSecurityToken GenerateJwtToken(ClaimsIdentity claimsIdentity)
    {
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Constants.JwtTokenKey)); // Replace "YourSecretKey" with your actual secret key
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "FooBar",
            audience: "Bartender",
            claims: claimsIdentity.Claims,
            expires: DateTime.Now.AddMinutes(30), // Token expiration time
            signingCredentials: creds
        );

        return token;
    }
}

public interface IUserService
{
    public Task<User> Login(LoginDto input);

    public ClaimsIdentity GenerateClaimsIdentity(User user);

    public JwtSecurityToken GenerateJwtToken(ClaimsIdentity claimsIdentity);
}