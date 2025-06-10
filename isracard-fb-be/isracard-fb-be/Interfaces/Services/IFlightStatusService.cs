public interface IFlightStatusService
{
    Task NotifyFlightStatusUpdated(string flightNumber, string status);
    Task NotifyFlightAdded(FlightDto flight);
    Task NotifyFlightDeleted(string flightNumber);
}
