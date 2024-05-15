using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace BeveragePaymentApi.Beverages;

public class NotificationService
    {
        private static readonly string GoServiceUrl = "http://engine:8080"; // Use service name 'engine'
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

        public Task SendBeverageCreatedNotificationAsync(Beverage beverage)
        {
            var data = new { beverageId = beverage.BeverageId };
            return SendNotificationAsync("/beverageAdded", data);
        }

        public Task SendBeverageUpdatedNotificationAsync(Beverage beverage)
        {
            var data = new { beverageId = beverage.BeverageId };
            return SendNotificationAsync("/beverageUpdated", data);
        }

        public Task SendBeverageDeletedNotificationAsync(Beverage beverage)
        {
            var data = new { beverageId = beverage.BeverageId};
            return SendNotificationAsync("/beverageRemoved", data);
        }

        private async Task SendNotificationAsync(string endpoint, object data)
        {
            using HttpClient client = _httpClientFactory.CreateClient();

            string json = JsonSerializer.Serialize(data);
            using HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");

            using HttpResponseMessage response = await client.PostAsync(new Uri($"{GoServiceUrl}{endpoint}"), content);
            
            if(!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to send notification to '{GoServiceUrl + endpoint}'. Message received from service: {response.Content.ReadAsStringAsync().Result}");
            }
            response.EnsureSuccessStatusCode();
        }
    }