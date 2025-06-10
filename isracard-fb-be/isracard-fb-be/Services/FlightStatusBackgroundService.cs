using isracard_fb_be.Interfaces.Services;
using isracard_fb_be.Enums;


public class FlightStatusBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(15);

    public FlightStatusBackgroundService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var flightStatusService = scope.ServiceProvider.GetRequiredService<IFlightStatusService>();
                var flightService = scope.ServiceProvider.GetRequiredService<IFlightService>();

                var flights = await flightService.GetAllFlightsAsync();

                foreach (var flight in flights)
                {
                    if (flight.Status == FlightStatus.Landed)
                        continue;
                    var newStatus = flightService.CalculateStatus(flight.DepartureTime);

                    if (flight.Status != newStatus)
                    {
                        // Update the status in the data store
                        flight.Status = newStatus;
                        await flightService.UpdateFlightAsync(flightService.MapToEntity(flight));

                        // Notify clients
                        await flightStatusService.NotifyFlightStatusUpdated(flight.FlightNumber, newStatus.ToString());
                    }
                }
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}
