using Microsoft.AspNetCore.SignalR;

public class FlightStatusService : IFlightStatusService
{
    private readonly IHubContext<FlightStatusHub> _hubContext;
    private readonly ILogger<FlightStatusService> _logger;

    public FlightStatusService(IHubContext<FlightStatusHub> hubContext, ILogger<FlightStatusService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;

    }

    public async Task NotifyFlightStatusUpdated(IEnumerable<FlightStatusUpdateDto> updates)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveFlightStatusUpdate", updates);
    }


    public async Task NotifyFlightAdded(FlightDto flight)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveFlightAdded", flight);
    }

    public async Task NotifyFlightDeleted(string flightNumber)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveFlightDeleted", flightNumber);
    }
}
