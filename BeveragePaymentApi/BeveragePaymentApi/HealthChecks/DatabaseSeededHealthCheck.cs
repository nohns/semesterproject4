using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Threading;
using System.Threading.Tasks;

public class DatabaseSeededHealthCheck : IHealthCheck
{
    private static bool _databaseSeeded = false;

    public static void MarkDatabaseAsSeeded()
    {
        Console.WriteLine("Database seeded!");
        _databaseSeeded = true;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_databaseSeeded ? HealthCheckResult.Healthy() : HealthCheckResult.Unhealthy());
    }
}