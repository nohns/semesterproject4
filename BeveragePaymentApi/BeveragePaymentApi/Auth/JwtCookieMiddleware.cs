using Microsoft.AspNetCore.Antiforgery;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Security.Claims;

namespace BeveragePaymentApi.Auth
{
    /// <summary>
    /// Middleware that gets jwt as cookie and sets the user for the application.
    /// </summary>
    public static class JwtCookieMiddleware
    {
        /// <summary>
        /// Checks the jwt cookie and sets the user for the application.
        /// </summary>
        /// <param name="app">App builder reference.</param>
        /// <param name="antiforgery">Reference to the antiforgery service.</param>
        /// <param name="key">The key to decrypt the token.</param>
        /// <param name="autoRefresh">Creates a new token if the token is half past expiration time (and still valid).</param>
        /// <param name="cookieName">Name of the cookie where the jwt is (defaults to jwt).</param>
        /// <param name="csrfCookieName">Name of the cookie where the request token is stored.</param>
        public static void UseJwtCookieMiddleware(this IApplicationBuilder app,
                                                  IAntiforgery antiforgery,
                                                  byte[] key,
                                                  bool autoRefresh = true,
                                                  string cookieName = "jwt",
                                                  string csrfCookieName = "XSRF-TOKEN")
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
                    // Clock skew compensates for server time drift.
                    ClockSkew = TimeSpan.FromMinutes(5),
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    RequireSignedTokens = true,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    // Ensure the token audience matches our audience value (default true):
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
                    context.Items[Constants.JwtTokenKey] = jwtToken;
                }
                catch (Exception)
                {
                    /*
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    context.Response.Cookies.Append(csrfCookieName,
                                                    tokens.RequestToken,
                                                    new CookieOptions() { HttpOnly = false, IsEssential = true, Secure = true, SameSite = SameSiteMode.None });
                                                    */
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