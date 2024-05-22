using BeveragePaymentApi.Domain;
using BeveragePaymentApi.Domain.Entities;
using BeveragePaymentApi.Domain.Exceptions;

namespace BeveragePaymentApi.Prices
{
    public class PriceService : IPriceService
    {
        private readonly IPriceRepository _priceRepository;

        public PriceService(IPriceRepository priceRepository)
        {
            _priceRepository = priceRepository;
        }

        public async Task<IEnumerable<Price>> GetAllPrices()
        {
            return await _priceRepository.GetAll();
        }

        public async Task<Price?> GetById(int id)
        {
            var price = await _priceRepository.GetById(id);

            if (price == null) 
                throw new NotFoundException("Price was not found.");

            return price;
        }

        public async Task<Price> Create(Price price)
        {
            return await _priceRepository.Create(price);
        }

        public async Task<Price> Update(Price price)
        {
            // Check if price exists
            await GetById(price.Id);

            return await _priceRepository.Update(price);
        }

        public async Task Delete(int id)
        {
            // Check if price exists
            await GetById(id);

            await _priceRepository.Delete(id);
        }
    }

    public interface IPriceService
    {
        Task<IEnumerable<Price>> GetAllPrices();
        Task<Price?> GetById(int id);
        Task<Price> Create(Price price);
        Task<Price> Update(Price price);
        Task Delete(int id);
    }
}