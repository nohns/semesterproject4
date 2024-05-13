


using Microsoft.AspNetCore.Mvc;
using BeveragePaymentApi;
using BeveragePaymentApi.Dto;
using Imagekit.Sdk;
using Imagekit.Models;
using System.Xml.Linq;

namespace BeveragePaymentApi.Images;

public class ImageApiController : Controller
{
    private readonly ImagekitClient _imageKit;

    public ImageApiController()
    {
        _imageKit = new ImagekitClient(Constants.ImageKitApiKey, Constants.ImageKitApiSecret, Constants.ImageKitUrlEndpoint);
    }

    [HttpPost]
    [Route("v1/image/upload")]
    public async Task<IActionResult> UploadImage([FromForm] ImageUploadDto imageDto)
    {
        try
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
            List<Extension> ext = new List<Extension>();

            BackGroundImage background = new BackGroundImage
            {
                name = "remove-bg"
            };

            ext.Add(background);

            newfile.extensions = ext;


            Result resp = _imageKit.Upload(newfile);

            return Ok(resp);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}