
using System;
using System.Security.Claims;
using BeveragePaymentApi.Dto;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace BeveragePaymentApi.Auth;

public class UserApiController : Controller
{
    public UserApiController(UserService userService, IAntiforgery antiforgery)
    {
        _userService = userService;
        _antiforgery = antiforgery;
    }

    private readonly UserService _userService;
    private readonly IAntiforgery _antiforgery;

    private void RefreshCSRFToken()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
        Response.Cookies.Append("XSRF-REQUEST-TOKEN", tokens.RequestToken, new CookieOptions
        {
            HttpOnly = false
        });
    }
    /*
        [HttpPost]
        [Route("login")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login([FromBody] LoginDto loginDto)
        {
            RefreshCSRFToken();
            var user = await _userService.Login(loginDto);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");

            };
            return Ok(user);
        }*/

}