using Asp.Versioning;
using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Drawing;
using BeveragePaymentApi.Images;
using BeveragePaymentApi.Dto;
using Dto;

namespace BeveragePaymentApi.Beverages;

[Route("v{version:apiVersion}/[controller]")]
[ApiController]
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
    [HttpPost]
    [ProducesResponseType<Beverage>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Beverage>> Post(Beverage beverage)
    {

        var beverageCreated = await _beverageService.Create(beverage);
        return CreatedAtRoute("GetById", new { id = beverageCreated.BeverageId }, value: beverageCreated);
    }

    [HttpPost]
    [Route("withImage")]
    [ProducesResponseType<Beverage>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Beverage>> PostWithImage([FromForm] BeverageWithImageDto beverage)
    {
        var imgUrl = "";
        try
        {
            imgUrl = await _imageApiService.UploadImage(new ImageUploadDto { File = beverage.File });

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        Beverage NewBeverage = new Beverage
        {
            Name = beverage.Name,
            Description = beverage.Description,
            BasePrice = beverage.BasePrice,
            MaxPrice = beverage.MaxPrice,
            MinPrice = beverage.MinPrice,
            ImageSrc = imgUrl
        };

        var beverageCreated = await _beverageService.Create(NewBeverage);
        return CreatedAtRoute("GetById", new { id = beverageCreated.BeverageId }, value: beverageCreated);
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
    public async Task<ActionResult<Beverage>> Put(int id, Beverage beverage)
    {
        try
        {
            beverage.BeverageId = id;
            var updatedBeverage = await _beverageService.Update(beverage);
            return Ok(updatedBeverage);
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
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

    [HttpGet("{id}/claim", Name = "Claim beverage price")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ClaimBeveragePrice(int id)
    {
        var beverage = await _beverageService.GetLatestPrice(id);
        if (beverage == null) return NotFound("Beverage not found");


        return Ok();
    }

}