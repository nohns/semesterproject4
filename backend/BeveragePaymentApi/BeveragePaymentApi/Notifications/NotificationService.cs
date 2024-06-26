using System.Text;
using System.Text.Json;
using BeveragePaymentApi.Domain.Entities;

namespace BeveragePaymentApi.Beverages;

public class NotificationService
{
    private static readonly string GoServiceUrl = "http://engine:8080";
    private readonly IHttpClientFactory _httpClientFactory;
    public NotificationService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
    }

    public Task SendBeverageOrderedNotificationAsync(Beverage beverage, int amount)
    {
        var data = new
        {
            beverageId = beverage.BeverageId,
            qty = amount
        };
        return SendNotificationAsync("/beverageOrdered", data);
    }

    public Task SendBeverageAddedNotificationAsync(Beverage beverage)
    {
        var data = new { beverageId = beverage.BeverageId };
        return SendNotificationAsync("/beverageAdded", data);
    }

    public Task SendBeverageUpdatedNotificationAsync(Beverage beverage)
    {
        var data = new { beverageId = beverage.BeverageId };
        return SendNotificationAsync("/beverageUpdated", data);
    }

    public Task SendBeverageRemovedNotificationAsync(Beverage beverage)
    {
        var data = new { beverageId = beverage.BeverageId };
        return SendNotificationAsync("/beverageRemoved", data);
    }

    private async Task SendNotificationAsync(string endpoint, object data)
    {
        using HttpClient client = _httpClientFactory.CreateClient();

        string json = JsonSerializer.Serialize(data);
        using HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");

        using HttpResponseMessage response = await client.PostAsync(new Uri($"{GoServiceUrl}{endpoint}"), content);

        if (!response.IsSuccessStatusCode)
        {
            Console.Write($"Failed to send notification to '{GoServiceUrl + endpoint}'");
            Console.WriteLine($"Message received from service: {response.Content.ReadAsStringAsync().Result}");
        }
    }
}