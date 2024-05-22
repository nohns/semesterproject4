using BeveragePaymentApi.Data;
using BeveragePaymentApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeveragePaymentApi.Beverages;

public class BeverageRepository : IBeverageRepository
{
    private readonly ApplicationDbContext _context;

    public BeverageRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Beverage>> GetAll()
    {
        return await _context.Beverages.ToListAsync();
    }

    public async Task<Beverage?> GetById(int id)
    {
        return await _context.Beverages.FirstOrDefaultAsync(b => b.BeverageId == id);
    }

    public async Task<Beverage> Create(Beverage beverage)
    {
        _context.Beverages.Add(beverage);
        await _context.SaveChangesAsync();
        return beverage;
    }

    public async Task<Beverage> Update(Beverage beverage)
    {
        _context.Beverages.Update(beverage);
        await _context.SaveChangesAsync();
        return beverage;
    }


    public async Task Delete(int id)
    {
        var beverageToDelete = await _context.Beverages.FindAsync(id);
        if (beverageToDelete != null) _context.Beverages.Remove(beverageToDelete);
        await _context.SaveChangesAsync();
    }
}

public interface IBeverageRepository
{
    public Task<IEnumerable<Beverage>> GetAll();
    public Task<Beverage?> GetById(int id);
    public Task<Beverage> Create(Beverage beverage);
    public Task<Beverage> Update(Beverage beverage);
    public Task Delete(int id);
}