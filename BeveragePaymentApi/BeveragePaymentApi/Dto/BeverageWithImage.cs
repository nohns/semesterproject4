namespace Dto;

public class BeverageWithImageDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public double BasePrice { get; set; }
    public double MaxPrice { get; set; }
    public double MinPrice { get; set; }
    public int HalfTime { get; set; }
    public double BuyMultiplier { get; set; }
    private bool isActive;
    public bool IsActive
    {
        get => isActive;
        set => isActive = value.ToString().ToLower() == "true" || value.ToString() == "1";
    }
    public IFormFile? File { get; set; }
}
