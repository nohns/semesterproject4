using BeveragePaymentApi.Data;
using BeveragePaymentApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace BeveragePaymentApi.Orders
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _context.Orders.ToListAsync();
        }

        public async Task<Order?> GetById(int id)
        {
            return await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == id);
        }

        public async Task<Order> Create(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<Order> Update(Order order)
        {
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task Delete(int id)
        {
            var orderToDelete = await _context.Orders.FindAsync(id);
            if (orderToDelete != null) _context.Orders.Remove(orderToDelete);
            await _context.SaveChangesAsync();
        }
    }

    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAll();
        Task<Order?> GetById(int id);
        Task<Order> Create(Order order);
        Task<Order> Update(Order order);
        Task Delete(int id);
    }
}