using isracard_fb_be.Enums;

namespace isracard_fb_be.Interfaces.Services
{
    public interface IFlightService
    {
        Task<IEnumerable<FlightDto>> GetAllFlightsAsync();

        Task<FlightDto> AddFlightAsync(FlightDto flight);
        
        Task UpdateFlightAsync(FlightDto flight);

        Task<bool> DeleteFlightAsync(string flightNumber);

        Task<IEnumerable<FlightDto>> GetFilteredFlightsAsync(string? status, string? destination);

        Task SaveChangesAsync();

        FlightStatus CalculateStatus(DateTime departureTime);
    }
}