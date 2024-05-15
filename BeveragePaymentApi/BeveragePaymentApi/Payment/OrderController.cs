using Asp.Versioning;
using BeveragePaymentApi.Data;
using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BeveragePaymentApi.Payment;

[Route("v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Route("Controller")]

public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrderController(ApplicationDbContext dbcontext)
    {
        _context = dbcontext;
    }

//Funny haha forsøg
    [HttpPost("Make An Order")]
    public async Task<ActionResult<CreateOrderDto>> MakeOrder(CreateOrderDto createOrderDto)
    {
        try
        {


            var newOrder = new Order
            {
                
                PriceId = createOrderDto.PriceId,
                StripeIntentId = null,
                TimeStamp = null,
                ExpiryTime = null


            };
            _context.Add(newOrder);
            await _context.SaveChangesAsync();
            return Ok(newOrder);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Fuck man det hele er OrderControllers skyld :C :{ex.Message}");
        }
    }
}
    