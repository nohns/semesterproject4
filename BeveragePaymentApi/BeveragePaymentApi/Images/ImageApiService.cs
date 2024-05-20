using BeveragePaymentApi.Dto;
using Imagekit.Sdk;


namespace BeveragePaymentApi.Images;

public class ImageApiService : IImageApiService
{
    private readonly ImagekitClient _imageKit;
    private readonly string _imageKitApiKey;
    private readonly string _imageKitApiSecret;
    private readonly string _imageKitUrlEndpoint;

    public ImageApiService(IConfiguration configuration)
    {
        _imageKitApiKey = configuration["ImageKitSettings:ApiKey"] ?? throw new ArgumentNullException(nameof(_imageKitApiKey));
        _imageKitApiSecret = configuration["ImageKitSettings:ApiSecret"] ?? throw new ArgumentNullException(nameof(_imageKitApiSecret));
        _imageKitUrlEndpoint = configuration["ImageKitSettings:UrlEndpoint"] ?? throw new ArgumentNullException(nameof(_imageKitUrlEndpoint));
        
        _imageKit = new ImagekitClient(_imageKitApiKey, _imageKitApiSecret, _imageKitUrlEndpoint);
    }

    public Task<string> UploadImage(ImageUploadDto imageDto)
    {

        byte[] fileBytes;
        using (MemoryStream ms = new MemoryStream())
        {
            imageDto.File.CopyTo(ms);
            fileBytes = ms.ToArray();
        }


        FileCreateRequest newfile = new FileCreateRequest
        {
            file = fileBytes,
            fileName = Guid.NewGuid().ToString()

        };
        List<string> tags = new List<string>
            {
                "TestingTags"
            };
        newfile.tags = tags;

        Result resp = _imageKit.Upload(newfile);

        return Task<string>.FromResult(resp.url);

    }
}

public interface IImageApiService
{
    public Task<string> UploadImage(ImageUploadDto imageDto);
}