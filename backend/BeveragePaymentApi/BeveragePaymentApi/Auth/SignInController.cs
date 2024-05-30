using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BeveragePaymentApi.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeveragePaymentApi.Auth;

public class SignInController : Controller
{
    public SignInController(IUserService userService)
    {
        _userService = userService;

    }

    private readonly IUserService _userService;
    [HttpPost]
    [Route("v1/auth/login")]

    public async Task<ActionResult<UserDetailsDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var userDto = await _userService.Login(loginDto);

            var claimsIdentity = _userService.GenerateClaimsIdentity(userDto);

            var token = _userService.GenerateJwtToken(claimsIdentity);

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            HttpContext.User = new ClaimsPrincipal(claimsIdentity);


            HttpContext.Response.Cookies.Append("jwt", jwtToken, new CookieOptions() { HttpOnly = true, IsEssential = true, SameSite = SameSiteMode.None, Secure = true });

            return Ok(new UserDetailsDto { Username = userDto.Username });


        }
        catch (Exception e)
        {
            return Unauthorized(e.Message);
        }
        /*
    
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (WrongPasswordException e)
        {
            return Unauthorized(e.Message);
        }
        */
    }

    [HttpGet]
    [Route("v1/auth/testUnprotected")]
    public IActionResult TestUnprotected()
    {
        return Ok("Unprotected");
    }

    [HttpGet]
    [Authorize]
    [Route("v1/auth/testProtected")]
    public IActionResult TestProtected()
    {
        return Ok("Protected");
    }


    [HttpPost]
    [Route("v1/auth/logout")]
    public IActionResult Logout()
    {
        HttpContext.Response.Cookies.Delete("jwt");
        return Ok();
    }

}