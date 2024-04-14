using BevPay.Infrastructure.Data;

namespace BevPay.Infrastructure.Repositories;

public abstract class Repository
{
    protected readonly BarContext Context;
    
    public Repository(BarContext context)
    {
        Context = context;
    }
}