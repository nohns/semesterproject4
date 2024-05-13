


using Microsoft.AspNetCore.Mvc;
using BeveragePaymentApi;
using BeveragePaymentApi.Dto;
using Imagekit.Sdk;
using Imagekit.Models;
using System.Xml.Linq;

namespace BeveragePaymentApi.Images;

public class ImageApiService : IImageApiService
{
    private readonly ImagekitClient _imageKit;

    public ImageApiService()
    {
        _imageKit = new ImagekitClient(Constants.ImageKitApiKey, Constants.ImageKitApiSecret, Constants.ImageKitUrlEndpoint);
    }

    public async Task<string> UploadImage(ImageUploadDto imageDto)
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

        return resp.url;

    }

}

public interface IImageApiService
{
    public Task<string> UploadImage(ImageUploadDto imageDto);
}