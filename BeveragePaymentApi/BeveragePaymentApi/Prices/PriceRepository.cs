using BeveragePaymentApi.Data;
using BeveragePaymentApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace BeveragePaymentApi.Repositories
{
    public class PriceRepository : IPriceRepository
    {
        private readonly ApplicationDbContext _context;

        public PriceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Price>> GetAll()
        {
            return await _context.Prices.ToListAsync();
        }

        public async Task<Price?> GetById(int id)
        {
            return await _context.Prices.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Price> Create(Price price)
        {
            _context.Prices.Add(price);
            await _context.SaveChangesAsync();
            return price;
        }

        public async Task<Price> Update(Price price)
        {
            _context.Entry(price).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return price;
        }

        public async Task Delete(int id)
        {
            var priceToDelete = await _context.Prices.FindAsync(id);
            if (priceToDelete != null) _context.Prices.Remove(priceToDelete);
            await _context.SaveChangesAsync();
        }
    }

    public interface IPriceRepository
    {
        Task<IEnumerable<Price>> GetAll();
        Task<Price?> GetById(int id);
        Task<Price> Create(Price price);
        Task<Price> Update(Price price);
        Task Delete(int id);
    }
}