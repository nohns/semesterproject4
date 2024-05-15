

namespace Dto;


public class BeverageDto
{
  public string? Name { get; set; }

  public string? Description { get; set; }

  public string? ImageSrc { get; set; }

  public double BasePrice { get; set; }

  public double MaxPrice { get; set; }

  public double MinPrice { get; set; }

  public bool IsActive { get; set; }

}
