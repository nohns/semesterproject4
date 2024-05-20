
namespace Dto;


public class BeverageWithImageDto
{
    public int BeverageId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public double BasePrice { get; set; }
    public double MaxPrice { get; set; }
    public double MinPrice { get; set; }

    public int HalfTime { get; set; }
    public double BuyMultiplier { get; set; }
    public IFormFile? File { get; set; }
}