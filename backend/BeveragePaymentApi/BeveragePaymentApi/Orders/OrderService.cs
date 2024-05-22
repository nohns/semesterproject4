using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Dto;
using BeveragePaymentApi.Domain.Exceptions;
using BeveragePaymentApi.Prices;
using Stripe;
using BeveragePaymentApi.Beverages;

namespace BeveragePaymentApi.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IPriceRepository _priceRepository;
        private readonly IBeverageService _beverageService;
        private readonly PaymentIntentService _intentService;
        private readonly NotificationService _notificationService;

        public OrderService(IOrderRepository orderRepository, IPriceRepository priceRepository, NotificationService notificationService, IBeverageService beverageService)
        {
            _orderRepository = orderRepository;
            _priceRepository = priceRepository;
            _beverageService = beverageService;
            _notificationService = notificationService;
            _intentService = new PaymentIntentService();

            StripeConfiguration.ApiKey = "sk_test_51PDTdFKZetYTOPv970qtAixsE1HQx463t9ti2ztmzEMtCm42tokDLTQR9ifQNmhBBF9Y3uoKpSfwvei7EBp7iprC00IQubXOaG";
        }

        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await _orderRepository.GetAll();
        }


        public async Task<Order?> GetById(int id)
        {
            var order = await _orderRepository.GetById(id, true);

            if (order == null)
            {
                throw new NotFoundException("Order not found");
            }
            return order;
        }

        public async Task<Order> CreateOrder(CreateOrderDto dto)
        {
            var newOrder = dto.ToOrder();

            // Create order with latest price and configure expiry
            var latestPrice = await _priceRepository.GetLatestPriceForBeverage(dto.BeverageId);
            newOrder.PriceId = latestPrice.Id;
            newOrder.Time = DateTime.UtcNow;
            newOrder.Expiry = DateTime.UtcNow.AddSeconds(60);
            var order = await _orderRepository.Create(newOrder);

            // Get an instance of order with the right properties populated
            order = await _orderRepository.GetById(order.OrderId, true);
            return order!;
        }

        public async Task<Order> ProcessOrder(int id, int quantity)
        {
            if (quantity < 1) throw new ValidationException("quantity below 1.");
            var order = await _orderRepository.GetById(id);
            if (order == null) throw new NotFoundException("order not found.");

            // Create intent
            var options = new PaymentIntentCreateOptions
            {
                Amount = Convert.ToInt64(order.Price.Amount * 100),
                Currency = "dkk",
            };
            var intent = _intentService.Create(options);

            // At this point the user can still cancel, but I'll take it 😈
            await _notificationService.SendBeverageOrderedNotificationAsync(order.Beverage, quantity);
            await _beverageService.IncreaseSoldUnits(order.Beverage.BeverageId, quantity);

            // Update order with Stripe intent
            order.StripeIntentId = intent.Id;
            order.StripeClientSecret = intent.ClientSecret;
            await _orderRepository.Update(order);
            order = await _orderRepository.GetById(order.OrderId, true);
            return order!;
        }

        public async Task<Order> UpdateOrder(int id, CreateOrderDto order)
        {
            var existingOrder = await _orderRepository.GetById(id);
            if (existingOrder == null)
            {
                throw new NotFoundException("Order was not found");
            }

            order.ToOrder(existingOrder);
            return await _orderRepository.Update(existingOrder);
        }

        public async Task DeleteOrder(int id)
        {
            var order = await _orderRepository.GetById(id);

            if (order == null) throw new NotFoundException("Beverage was not found.");

            await _orderRepository.Delete(id);


        }

        public async Task<List<BeveragePaymentApi.Domain.Entities.Price>> GetOrderPrices(int id)
        {
            var order = await _orderRepository.GetById(id);
            if (order == null)
            {
                throw new NotFoundException("Order not found.");
            }
            var prices = await _orderRepository.GetPricesFrom(order.BeverageId, order.PriceId);
            if (prices == null)
            {
                throw new NotFoundException("Prices not found for order.");
            }
            foreach (var price in prices)
            {
                price.Orders = null;
                price.Beverage = null;
            }
            return prices;
        }

    }
}

public interface IOrderService
{
    public Task<IEnumerable<Order>> GetAllOrders();
    public Task<Order?> GetById(int id);
    public Task<Order> CreateOrder(CreateOrderDto order);
    public Task<Order> ProcessOrder(int id, int quantity);
    public Task<Order> UpdateOrder(int id, CreateOrderDto order);
    public Task DeleteOrder(int id);
    public Task<List<BeveragePaymentApi.Domain.Entities.Price>> GetOrderPrices(int id);
}
