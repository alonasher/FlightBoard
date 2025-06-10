using isracard_fb_be.Enums;

namespace isracard_fb_be.Interfaces.Services
{
    public interface IFlightService
    {
        Task<IEnumerable<FlightDto>> GetAllFlightsAsync();

        Task<FlightDto> GetByFlightNumberAsync(string flightNumber);

        Task<FlightDto> AddFlightAsync(FlightDto flight);
        
        Task UpdateFlightAsync(Flight flight);

        Task<bool> DeleteFlightAsync(string flightNumber);

        Task<IEnumerable<FlightDto>> GetFilteredFlightsAsync(string? status, string? destination);

        Task SaveChangesAsync();

        FlightStatus CalculateStatus(DateTime departureTime);

        Flight MapToEntity(FlightDto dto);
    }
}