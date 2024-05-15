using BeveragePaymentApi.Data;
using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Exceptions;
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
        var existingBeverage = await _context.Beverages.FindAsync(beverage.BeverageId);
        if (existingBeverage == null)
        {
            throw new NotFoundException($"Beverage with ID {beverage.BeverageId} not found.");
        }

        // Update the properties
        existingBeverage.Name = beverage.Name;
        existingBeverage.Description = beverage.Description;
        existingBeverage.ImageSrc = beverage.ImageSrc;
        existingBeverage.BasePrice = beverage.BasePrice;
        existingBeverage.MaxPrice = beverage.MaxPrice;
        existingBeverage.MinPrice = beverage.MinPrice;
        existingBeverage.IsActive = beverage.IsActive;

        _context.Beverages.Update(existingBeverage);
        await _context.SaveChangesAsync();

        return existingBeverage;
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