public interface IFlightStatusService
{
    Task NotifyFlightStatusUpdated(IEnumerable<FlightStatusUpdateDto> updates);
    Task NotifyFlightAdded(FlightDto flight);
    Task NotifyFlightDeleted(string flightNumber);
}