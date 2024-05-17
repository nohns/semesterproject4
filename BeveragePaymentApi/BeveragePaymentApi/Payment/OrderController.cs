using Asp.Versioning;
using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Domain.Exceptions;
using BeveragePaymentApi.Dto;
using Microsoft.AspNetCore.Mvc;
using BeveragePaymentApi.Orders;

namespace BeveragePaymentApi.Payment
{
    [Route("v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<CreateOrderDto>> MakeOrder(CreateOrderDto createOrderDto)
        {
            try
            {
                var newOrder = await _orderService.CreateOrder(createOrderDto);
                return CreatedAtRoute("GetById", new { id = newOrder.OrderId }, newOrder);
            }
            catch (ValidationException e)
            {
                return BadRequest(new { Message = e.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal server error in OrderController.", Details = ex.Message });
            }
        }

        [HttpGet("id")]
        public async Task<ActionResult<Order>> GetById(int id)
        {
            try
            {
                var order = await _orderService.GetById(id);
                return Ok(order);
            }
            catch (NotFoundException e)
            {
                return NotFound(new { Message = e.Message });
            }
        }
    }
}