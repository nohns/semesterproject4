using Asp.Versioning;
using BeveragePaymentApi.Domain;
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
    ///         "name": "Blå vand"
    ///     }
    /// </remarks>
    [HttpPost]
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
    public async Task<ActionResult<Beverage>> Put(int id, Beverage beverage)
    {
        beverage.Id = id;

        var updatedBeverage = await _beverageService.Update(beverage);

        return Ok(updatedBeverage);
    }

    /// <summary>
    /// Deletes a Beverage
    /// </summary>
    /// <param name="id"></param>
    /// <returns>Nothing.</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _beverageService.Delete(id);
        return NoContent(); 
    }
    
}