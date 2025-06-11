using isracard_fb_be.Interfaces.Services;
using isracard_fb_be.Enums;


public class FlightStatusBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(60);
    private readonly ILogger<FlightStatusBackgroundService> _logger;

    public FlightStatusBackgroundService(IServiceProvider serviceProvider, ILogger<FlightStatusBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;

    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var flightStatusService = scope.ServiceProvider.GetRequiredService<IFlightStatusService>();
                var flightService = scope.ServiceProvider.GetRequiredService<IFlightService>();

                var flights = (await flightService.GetAllFlightsAsync()).ToList();
                var updates = new List<FlightStatusUpdateDto>();

                foreach (var flight in flights)
                {
                    if (flight.Status == FlightStatus.Landed)
                        continue;

                    var newStatus = flightService.CalculateStatus(flight.DepartureTime);

                    if (flight.Status != newStatus)
                    {
                        flight.Status = newStatus;
                        await flightService.UpdateFlightAsync(flight);

                        updates.Add(new FlightStatusUpdateDto
                        {
                            FlightNumber = flight.FlightNumber,
                            Status = newStatus
                        });
                    }
                }

                if (updates.Count > 0)
                {
                    _logger.LogInformation("Notifying clients of {UpdatesCount} flight status updates", updates.Count);
                    await flightStatusService.NotifyFlightStatusUpdated(updates);
                }
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}
