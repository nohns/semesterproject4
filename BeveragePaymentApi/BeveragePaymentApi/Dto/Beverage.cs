

namespace Dto;


public class BeverageDto
{
    public string? BeverageId {get; set;}

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? ImageSrc { get; set; }

    public double BasePrice { get; set; }

    public double MaxPrice { get; set; }

    public double MinPrice { get; set; }
}