//Inspiration taken from
//https://medium.com/@marcos.deaguiar/spa-with-cookie-authentication-in-asp-net-core-c7ba6d9f8ebe


using Microsoft.AspNetCore.Antiforgery;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
namespace BeveragePaymentApi.Auth
{
    public static class JwtCookieMiddleware
    {
        private static string jwtKey = null;
        public static void Initialize(IConfiguration configuration)
        {
            jwtKey = configuration["JwtSettings:Key"];
        }

        public static void UseJwtCookieMiddleware(this IApplicationBuilder app,
                                                  byte[] key,
                                                  bool autoRefresh = true,
                                                  string cookieName = "jwt")
        {
            app.Use(async (context, next) =>
            {
                string jwtStr = context.Request.Cookies[cookieName];

                if (string.IsNullOrEmpty(jwtStr))
                {
                    await next();
                    return;
                }

                var validationParameters = new TokenValidationParameters
                {
                    ClockSkew = TimeSpan.FromMinutes(5),
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    RequireSignedTokens = true,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ValidateAudience = false,
                    ValidateIssuer = false
                };

                ClaimsIdentity claimsIdentity = null;
                ClaimsPrincipal newPrincipal;
                JwtSecurityToken jwtToken = null;

                try
                {
                    var claimsPrincipal = new JwtSecurityTokenHandler()
                                              .ValidateToken(jwtStr,
                                                             validationParameters,
                                                             out var rawValidatedToken);
                    claimsIdentity = new ClaimsIdentity("AuthenticationTypes.Federation");
                    foreach (var claim in claimsPrincipal.Claims)
                    {
                        if (claim.Type == "iat" ||
                            claim.Type == "exp" ||
                            claim.Type == "nbf")
                        {
                            continue;
                        }

                        claimsIdentity.AddClaim(claim);
                    }
                    newPrincipal = new ClaimsPrincipal(claimsIdentity);
                    context.User = newPrincipal;


                    jwtToken = rawValidatedToken as JwtSecurityToken;
                    context.Items[jwtKey] = jwtToken;
                }
                catch (Exception)
                {
                    context.Response.Cookies.Delete(cookieName);
                }

                if (autoRefresh &&
                    jwtToken != null &&
                    claimsIdentity != null)
                {
                    CheckAndRefreshToken(key, claimsIdentity, jwtToken, cookieName, context);
                }

                await next();
            });
        }

        private static void CheckAndRefreshToken(byte[] key, ClaimsIdentity claimsIdentity, JwtSecurityToken jwtToken, string cookieName, HttpContext context)
        {
            TimeSpan spanToken = jwtToken.ValidTo - jwtToken.IssuedAt;
            TimeSpan spanExpire = jwtToken.ValidTo - DateTime.UtcNow;

            double secondsToken = spanToken.TotalSeconds;
            double secondsExpire = spanExpire.TotalSeconds;

            if (secondsExpire > (secondsToken / 2))
            {
                return;
            }

            var token = GenerateNewJwtToken(key, claimsIdentity, spanToken);
            context.Response.Cookies.Append(cookieName,
                                            token,
                                            new CookieOptions() { HttpOnly = true, IsEssential = true, Secure = true, SameSite = SameSiteMode.None });
        }

        private static string GenerateNewJwtToken(byte[] key, ClaimsIdentity claimsIdentity, TimeSpan expiration)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimsIdentity,
                Expires = DateTime.UtcNow + expiration,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

}