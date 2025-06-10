using Microsoft.AspNetCore.SignalR;

public class FlightStatusService : IFlightStatusService
{
    private readonly IHubContext<FlightStatusHub> _hubContext;

    public FlightStatusService(IHubContext<FlightStatusHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyFlightStatusUpdated(string flightNumber, string status)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveFlightStatusUpdate", flightNumber, status);
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
