using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Dto;
using BeveragePaymentApi.Domain.Exceptions;
using BeveragePaymentApi.Prices;
using Stripe;

namespace BeveragePaymentApi.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IPriceRepository _priceRepository;
        private readonly PaymentIntentService _intentService;

        public OrderService(IOrderRepository orderRepository, IPriceRepository priceRepository)
        {
            _orderRepository = orderRepository;
            _priceRepository = priceRepository;
            _intentService = new PaymentIntentService();
        }

        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await _orderRepository.GetAll();
        }


        public async Task<Order?> GetById(int id)
        {
            var order = await _orderRepository.GetById(id);

            if (order == null)
            {
                throw new NotFoundException("Order not found");
            }
            return order;
        }

        public async Task<Order> CreateOrder(CreateOrderDto dto)
        {
            var newOrder = dto.ToOrder();

            var latestPrice = await _priceRepository.GetLatestPriceForBeverage(dto.BeverageId);
            var options = new PaymentIntentCreateOptions
            {
                Amount = Convert.ToInt64(latestPrice.Amount * 100),
                Currency = "dkk",
            };
            var intent = _intentService.Create(options);
            newOrder.StripeIntentId = intent.Id;
            newOrder.StripeClientSecret = intent.ClientSecret;
            newOrder.Time = DateTime.Now;
            newOrder.Expiry = DateTime.Now.AddSeconds(300);

            return await _orderRepository.Create(newOrder);
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
    }
}

public interface IOrderService
{
    public Task<IEnumerable<Order>> GetAllOrders();
    public Task<Order?> GetById(int id);
    public Task<Order> CreateOrder(CreateOrderDto order);
    public Task<Order> UpdateOrder(int id, CreateOrderDto order);
    public Task DeleteOrder(int id);

}
