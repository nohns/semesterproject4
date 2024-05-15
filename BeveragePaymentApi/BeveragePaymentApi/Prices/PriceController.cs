using BeveragePaymentApi.Domain.Exceptions;
using BeveragePaymentApi.Dto;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using BeveragePaymentApi.Beverages;


namespace BeveragePaymentApi.Prices
{
    [ApiController]
    [Route("v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    
    public class PriceController : Controller
    {
        private readonly IPriceService _priceService;
        private readonly IBeverageService _beverageService;

        public PriceController(IPriceService priceService, IBeverageService beverageService)
        {
            _priceService = priceService;
            _beverageService = beverageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Price>>> GetAllPrices()
        {
            var prices = await _priceService.GetAllPrices();
            return Ok(prices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Price>> GetPriceById(int id)
        {
            try
            {
                var price = await _priceService.GetById(id);
                return Ok(price);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult AddPrice(PriceDto priceDto)
        {
            // Find den beverage der skal associeres med price
            var beverage = _beverageService.GetById(priceDto.BeverageId);

            if (beverage == null)
            {
                return NotFound("Beverage not found");
            }

            // Create a Price entity
            var price = new Price
            {
                BeverageId = priceDto.BeverageId,
                Amount = priceDto.Amount,
                Timestamp = priceDto.Timestamp,
                //Beverage = beverage // Fucker lige rundt her ok
            };
            _priceService.Create(price);

            return Ok("Price added successfully");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Price>> UpdatePrice(int id, PriceDto updatePriceDto)
        {
            try
            {
                var priceToUpdate = await _priceService.GetById(id);
                if (priceToUpdate == null)
                {
                    return NotFound("Price not found.");
                }

                priceToUpdate.Amount = updatePriceDto.Amount;
                var updatedPrice = await _priceService.Update(priceToUpdate);
                return Ok(updatedPrice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePrice(int id)
        {
            try
            {
                await _priceService.Delete(id);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
