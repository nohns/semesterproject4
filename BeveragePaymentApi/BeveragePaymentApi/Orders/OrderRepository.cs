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
      return await GetById(id, false);
    }

    public async Task<Order?> GetById(int id, bool pruneCycles)
    {
      var order = await _context.Orders.Include(o => o.Beverage).Include(o => o.Price).FirstOrDefaultAsync(o => o.OrderId == id);
      if (pruneCycles && order != null)
      {
        order.Beverage.Prices = null;
        order.Price.Beverage = null;
        order.Price.Orders = null;
      }
      return order;
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

    public async Task<List<Price>?> GetPricesFrom(int beverageId, int fromPriceId)
    {
      var prices = _context.Prices.Where(p => p.BeverageId.Equals(beverageId)).Where(p => p.Id <= fromPriceId).OrderByDescending(p => p.Id).Take(20);
      var list = await prices.ToListAsync();
      list.Reverse();
      return list;
    }
  }

  public interface IOrderRepository
  {
    Task<IEnumerable<Order>> GetAll();
    Task<Order?> GetById(int id);
    Task<Order?> GetById(int id, bool pruneCycles);
    Task<Order> Create(Order order);
    Task<Order> Update(Order order);
    Task Delete(int id);
    Task<List<Price>?> GetPricesFrom(int beverageId, int fromPriceId);
  }
}
