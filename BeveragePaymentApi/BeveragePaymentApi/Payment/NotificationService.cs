using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace BeveragePaymentApi.Beverages;

public class NotificationService
    {
        private static readonly string GoServiceUrl = "http://price-engine/"; // Use service name 'engine'
        private readonly IHttpClientFactory _httpClientFactory;

        public NotificationService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        }

        public Task SendOrderFulfilledNotificationAsync(Beverage beverage)
        {
            var data = new { beverageId = beverage.BeverageId };
            return SendNotificationAsync("beveragePurchased", data);
        }

        public Task SendBeverageCreatedNotificationAsync()
        {
            var data = new { message = "A new beverage has been created" };
            return SendNotificationAsync("beverageCreated", data);
        }

        public Task SendBeverageUpdatedNotificationAsync()
        {
            var data = new { message = "A beverage has been updated" };
            return SendNotificationAsync("beverageUpdated", data);
        }

        public Task SendBeverageDeletedNotificationAsync()
        {
            var data = new { message = "A beverage has been deleted" };
            return SendNotificationAsync("beverageDeleted", data);
        }

        private async Task SendNotificationAsync(string endpoint, object data)
        {
            using HttpClient client = _httpClientFactory.CreateClient();

            string json = JsonSerializer.Serialize(data);
            using HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");

            using HttpResponseMessage response = await client.PostAsync($"{GoServiceUrl}{endpoint}", content);

            response.EnsureSuccessStatusCode();
        }
    }