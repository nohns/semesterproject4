using BevPay.Core.Services;
using Microsoft.AspNetCore.Mvc;
using BevPay.Infrastructure.Repositories;

namespace BevPay.Web.Controllers;

[Route("v1/[controller]")]
[ApiController]
public class BeveragesController : ControllerBase
{
    private readonly BeverageService _beverageService;
    
    public BeveragesController(BeverageService beverageService)
    {
        _beverageService = beverageService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetBeverages()
    {
        var beverages = await _beverageService.GetBeverages();
        return Ok(beverages);
    }
}