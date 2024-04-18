using Asp.Versioning;
using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace BeveragePaymentApi.Beverages;

[Route("v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("1.0")]
public  class BeveragesController : Controller
{
    private readonly IBeverageService _beverageService;
    
    public BeveragesController(IBeverageService beverageService)
    {
        _beverageService = beverageService;
    }
    
    /// <summary>
    /// Gets all beverages
    /// </summary>
    /// <returns>A list of Beverages</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Beverage>>> Get()
    {
        var beverages = await _beverageService.GetAllBeverages();
        return Ok(beverages);
    }
    
    /// <summary>
    /// Gets a specific Beverage
    /// </summary>
    /// <param name="id"></param>
    /// <returns>A specific Beverage</returns>
    [HttpGet("{id}", Name = "GetById")]
    [ProducesResponseType<Beverage>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Beverage>> GetById(int id)
    {
        var beverage = await _beverageService.GetById(id);
        return Ok(beverage);
    }

    /// <summary>
    /// Creates a Beverage
    /// </summary>
    /// <param name="beverage"></param>
    /// <returns>A newly created Beverage</returns>
    /// <remarks>
    /// Sample request:
    /// 
    ///     {   
    ///         "name": "Blå vand",
    ///         "upperBoundary": 15,
    ///         "lowerBoundary": 25,
    ///         "baseValue": 20
    ///     }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType<Beverage>(StatusCodes.Status201Created)]
    public async Task<ActionResult<Beverage>> Post(Beverage beverage)
    {
        var beverageCreated = await _beverageService.Create(beverage);
        return CreatedAtRoute("GetById", new { id = beverageCreated.Id }, value: beverageCreated);
    }
    
    /// <summary>
    /// Updates a Beverage
    /// </summary>
    /// <param name="id"></param>
    /// <param name="beverage"></param>
    /// <returns>The updated Beverage</returns>
    [HttpPut("{id}")]
    [ProducesResponseType<Beverage>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Beverage>> Put(int id, Beverage beverage)
    {
        try
        {
            beverage.Id = id;

            var updatedBeverage = await _beverageService.Update(beverage);

            return Ok(updatedBeverage);
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
    }

    /// <summary>
    /// Deletes a Beverage
    /// </summary>
    /// <param name="id"></param>
    /// <returns>Nothing.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id)
    {
        await _beverageService.Delete(id);
        return NoContent(); 
    }
    
}