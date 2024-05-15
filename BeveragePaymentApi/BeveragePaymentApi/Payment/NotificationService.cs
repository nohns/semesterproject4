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
    public async void SendPurchaseNotificationAsync(Beverage beverage, int amount)
    {
        using HttpClient client = _httpClientFactory.CreateClient();

        var purchaseData = new
        {
            BeverageId = beverage,
            Amount = amount
        };

        string json = JsonSerializer.Serialize(purchaseData);
        using HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");
        
        
        //Chore: Snak med asger
        using HttpResponseMessage response = await client.PostAsync(
            "/bevaragePurchased",
            content
        );
    }
}