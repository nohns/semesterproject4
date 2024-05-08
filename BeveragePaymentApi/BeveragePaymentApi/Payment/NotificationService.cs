using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace BeveragePaymentApi.Beverages;

public class NotificationService
{
    private readonly IHttpClientFactory _httpClientFactory = null!;

    public NotificationService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }
    public async void SendPurchaseNotificationAsync(Beverage beverage, double price)
    {
        using HttpClient client = _httpClientFactory.CreateClient();

        var purchaseData = new
        {
            Beverage = beverage,
            Price = price
        };

        string json = JsonSerializer.Serialize(purchaseData);
        using HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");

        using HttpResponseMessage response = await client.PostAsync(
            "placeholder/url",
            content
        );
    }
}