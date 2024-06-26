﻿using BeveragePaymentApi.Data;
using BeveragePaymentApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeveragePaymentApi.Prices

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

        public async Task<Price> GetLatestPriceForBeverage(int beverageId)
        {
            var price = await _context.Prices.Where(p => p.Beverage.BeverageId.Equals(beverageId)).OrderByDescending(p => p.Timestamp).FirstAsync();
            return price;
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
        Task<Price> GetLatestPriceForBeverage(int beverageId);
        Task<IEnumerable<Price>> GetAll();
        Task<Price?> GetById(int id);
        Task<Price> Create(Price price);
        Task<Price> Update(Price price);
        Task Delete(int id);
    }
}
