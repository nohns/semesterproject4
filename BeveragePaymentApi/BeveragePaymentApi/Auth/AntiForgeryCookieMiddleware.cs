using Microsoft.AspNetCore.Antiforgery;

public static class AntiforgeryCookieMiddleware
{
    /// <summary>
    /// Adds an antiforgery cookie to the response.
    /// </summary>
    /// <param name="app">Application builder instance.</param>
    /// <param name="antiforgery">Antiforgery service.</param>
    /// <param name="cookieName">Name of the cookie where the token will be added.</param>
    public static void UseAntiforgeryCookieMiddleware(this IApplicationBuilder app,
                                                      IAntiforgery antiforgery,
                                                      string cookieName = "XSRF-TOKEN")
    {
        app.Use(async (context, next) =>
        {
            var tokens = antiforgery.GetAndStoreTokens(context);
            context.Response.Cookies.Append(cookieName,
                                            tokens.RequestToken!,
                                            new CookieOptions() { HttpOnly = false, IsEssential = true, Secure = true, SameSite = SameSiteMode.None });
            await next();
        });
    }
}