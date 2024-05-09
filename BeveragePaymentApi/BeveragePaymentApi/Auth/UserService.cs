

using BeveragePaymentApi.Dto;

namespace BeveragePaymentApi.Auth;

public class UserService
{
    private readonly UserRepository _userRepository;
    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public int Login(LoginDto loginDto)
    {
        return _userRepository.FindUser(loginDto);
    }
}