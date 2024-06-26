using Asp.Versioning;
using BeveragePaymentApi.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Images;
using BeveragePaymentApi.Dto;
using Dto;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace BeveragePaymentApi.Beverages;

[Route("v{version:apiVersion}/[controller]")]
[ApiController]
[Authorize]
[ApiVersion("1.0")]
public class BeveragesController : Controller
{
    private readonly IBeverageService _beverageService;
    private readonly IImageApiService _imageApiService;

    public BeveragesController(IBeverageService beverageService, IImageApiService imageApiService)
    {
    _beverageService = beverageService;
    _imageApiService = imageApiService;
    }


    /// <summary>
    /// Gets all beverages
    /// </summary>
    /// <returns>A list of Beverages</returns>
    [HttpGet]
    [ProducesResponseType<IEnumerable<Beverage>>(StatusCodes.Status200OK)]
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
        try
        {
            var beverage = await _beverageService.GetById(id);
            return Ok(beverage);
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
    }

    /// <summary>
    /// Creates a Beverage
    /// </summary>
    /// <param name="dto"></param>
    /// <returns>A newly created Beverage</returns>
    [HttpPost]
    [ProducesResponseType<Beverage>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Beverage>> Post(BeverageDto dto)
    {
    try
    {
    var beverageCreated = await _beverageService.Create(dto);
    return CreatedAtRoute("GetById", new { id = beverageCreated.BeverageId }, value: beverageCreated);
    }
    catch (ValidationException e)
    {
    return BadRequest(e.Message);
    }
    catch (Exception e)
    {
    return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
    }
    }

    [HttpPost]
    [Route("withImage")]
    [ProducesResponseType<Beverage>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Beverage>> PostWithImage([FromForm] BeverageWithImageDto beverage)
    {
        // Convert IsActive if it's not already a boolean
        if (beverage.IsActive.ToString().ToLower() != "true" && beverage.IsActive.ToString() != "1")
        {
            beverage.IsActive = false;
        }

        // Log the received data
        Console.WriteLine($"Received BeverageWithImageDto: {JsonConvert.SerializeObject(beverage)}");

        var imgUrl = "";
        try
        {
            imgUrl = await _imageApiService.UploadImage(new ImageUploadDto { File = beverage.File });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        BeverageDto dto = new BeverageDto
        {
            Name = beverage.Name,
            Description = beverage.Description,
            BasePrice = beverage.BasePrice,
            MaxPrice = beverage.MaxPrice,
            MinPrice = beverage.MinPrice,
            BuyMultiplier = beverage.BuyMultiplier,
            HalfTime = beverage.HalfTime,
            ImageSrc = imgUrl,
            IsActive = beverage.IsActive
        };

        // Log the DTO created from the received data
        Console.WriteLine($"Created BeverageDto: {JsonConvert.SerializeObject(dto)}");

        try
        {
            var beverageCreated = await _beverageService.Create(dto);
            return CreatedAtRoute("GetById", new { id = beverageCreated.BeverageId }, value: beverageCreated);
        }
        catch (ValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
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
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Beverage>> Put([FromRoute] int id, [FromBody] BeverageDto beverage)
    {
    try
    {
    var updatedBeverage = await _beverageService.Update(id, beverage);
    return Ok(updatedBeverage);
    }
    catch (NotFoundException e)
    {
    return NotFound(e.Message);
    }
    catch (ValidationException e)
    {
    return BadRequest(e.Message);
    }
    catch (Exception e)
    {
    return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
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
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
    try
    {
    await _beverageService.Delete(id);
    return NoContent();
    }
    catch (NotFoundException e)
    {
    return NotFound(e.Message);
    }
    catch (Exception e)
    {
    return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
    }
    }
}
