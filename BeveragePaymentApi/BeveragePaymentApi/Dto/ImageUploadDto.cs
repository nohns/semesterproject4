
namespace BeveragePaymentApi.Dto
{
    public class ImageUploadDto
    {
        public string UploaderName { get; set; }
        public string UploaderAddress { get; set; }
        public IFormFile File { get; set; }

    }
}