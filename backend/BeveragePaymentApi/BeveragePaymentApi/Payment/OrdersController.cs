using Asp.Versioning;
using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Domain.Exceptions;
using BeveragePaymentApi.Dto;
using Microsoft.AspNetCore.Mvc;

namespace BeveragePaymentApi.Payment
{
  [Route("v{version:apiVersion}/[controller]")]
  [ApiController]
  [ApiVersion("1.0")]
  public class OrdersController : ControllerBase
  {
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
      _orderService = orderService;
    }

    [HttpPost]
    public async Task<ActionResult<CreateOrderDto>> MakeOrder(CreateOrderDto createOrderDto)
    {
      try
      {
        var newOrder = await _orderService.CreateOrder(createOrderDto);
        newOrder.Price = null;
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

    [HttpPost("{id}/process")]
    public async Task<ActionResult<Order>> ProcessOrder(int id, ProcessOrderDto dto)
    {
      try
      {
        var order = await _orderService.ProcessOrder(id, dto.Quantity);
        return Ok(order);
      }
      catch (NotFoundException e)
      {
        return NotFound(new { Message = e.Message });
      }
      catch (ValidationException e)
      {
        return BadRequest(new { Message = e.Message });
      }
    }

    [HttpGet("{id}")]
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

    [HttpGet("{id}/prices")]
    public async Task<ActionResult<List<Price>>> GetOrderPrices(int id)
    {
      try
      {
        var prices = await _orderService.GetOrderPrices(id);
        return Ok(prices);
      }
      catch (NotFoundException e)
      {
        return NotFound(new { Message = e.Message });
      }
    }
  }
}
