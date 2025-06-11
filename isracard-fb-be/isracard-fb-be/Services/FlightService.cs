using isracard_fb_be.Interfaces.Repositories;
using isracard_fb_be.Interfaces.Services;
using Microsoft.EntityFrameworkCore;
using isracard_fb_be.Enums;
using isracard_fb_be.Helpers;

public class FlightService : IFlightService
{
    private readonly IFlightRepository _repo;
    private readonly IFlightStatusService _flightStatusService;
    private readonly ILogger<FlightService> _logger;

    public FlightService(IFlightRepository repo, IFlightStatusService flightStatusService, ILogger<FlightService> logger)
    {
        _repo = repo;
        _flightStatusService = flightStatusService;
        _logger = logger;
    }

    public async Task<IEnumerable<FlightDto>> GetAllFlightsAsync()
    {
        try
        {
            var flights = (await _repo.GetAllAsync()).ToList();

            return flights.Select(FlightMappingService.MapToDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all flights.");
            return Enumerable.Empty<FlightDto>();
        }
    }

    public async Task<FlightDto> AddFlightAsync(FlightDto flightDto)
    {
        try
        {
            if( !IsValidFlightDto(flightDto))
                return null;

            var flight = FlightMappingService.MapToEntity(flightDto);
            flight.Status = CalculateStatus(flight.DepartureTime);

            await _repo.AddAsync(flight);
            await _repo.SaveChangesAsync();
            _logger.LogInformation("Flight with number {FlightNumber} added successfully.", flightDto.FlightNumber);

            var addedFlightDto = FlightMappingService.MapToDto(flight);
            await _flightStatusService.NotifyFlightAdded(addedFlightDto);

            return addedFlightDto;
        }
        catch (DbUpdateException ex) when (ex.InnerException != null && ex.InnerException.Message.Contains("UNIQUE"))
        {
            _logger.LogWarning(ex, "Flight number {FlightNumber} already exists.", flightDto?.FlightNumber);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding flight with number {FlightNumber}.", flightDto?.FlightNumber);
            return null;
        }
    }

    public async Task UpdateFlightAsync(FlightDto flightDto)
    {
        try
        {
            if (!IsValidFlightDto(flightDto))
                return;

            var flight = FlightMappingService.MapToEntity(flightDto);

            await _repo.UpdateAsync(flight);
            await _repo.SaveChangesAsync();
            _logger.LogInformation("Flight with number {FlightNumber} updated successfully.", flightDto.FlightNumber);
        }
        catch (Exception)
        {
            _logger.LogError("Error updating flight with number {FlightNumber}.", flightDto.FlightNumber);
            return;
        }
        
    }

    public async Task<bool> DeleteFlightAsync(string flightNumber)
    {
        try
        {
            var flight = await _repo.GetByFlightNumberAsync(flightNumber);
            if (flight == null)
                return false;
            _repo.Remove(flight);
            await _repo.SaveChangesAsync();
            _logger.LogInformation("Flight with ID {FlightId} deleted successfully.", flightNumber);

            await _flightStatusService.NotifyFlightDeleted(flightNumber);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting flight with ID {FlightId}.", flightNumber);
            return false;
        }
    }

    public async Task<IEnumerable<FlightDto>> GetFilteredFlightsAsync(string? status, string? destination)
    {
        try
        {
            var flights = await _repo.GetAllAsync();
            if (!string.IsNullOrEmpty(destination))
                flights = flights.Where(f => f.Destination.ToLower().Contains(destination.ToLower()));

            var filtered = flights.ToList();
            foreach (var flight in filtered)
            {
                var newStatus = CalculateStatus(flight.DepartureTime);
                if (flight.Status != newStatus)
                {
                    flight.Status = newStatus;
                }
            }
            await _repo.SaveChangesAsync();

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<FlightStatus>(status, out var statusEnum))
                filtered = filtered.Where(f => f.Status == statusEnum).ToList();

            return filtered.Select(FlightMappingService.MapToDto).OrderBy(f => f.DepartureTime).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving filtered flights. Status: {Status}, Destination: {Destination}", status, destination);
            return Enumerable.Empty<FlightDto>();
        }
    }

    public async Task SaveChangesAsync()
    {
        try
        {
            await _repo.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving changes to the repository.");
            return;
        }
    }

    public FlightStatus CalculateStatus(DateTime departureTime)
    {
        var now = DateTime.Now;
        var diff = (departureTime - now).TotalMinutes;
        if (diff > 30)
            return FlightStatus.Scheduled;
        if (diff > 10)
            return FlightStatus.Boarding;
        if (diff >= -15)
            return FlightStatus.Departed;
        if (diff >= -60)
            return FlightStatus.Delayed;
        return FlightStatus.Landed;
    }

    private bool IsValidFlightDto(FlightDto flightDto)
    {
        if (flightDto == null)
        {
            _logger.LogWarning("Attempted to add a null flight.");
            return false;
        }

        if (flightDto.DepartureTime <= DateTime.UtcNow)
        {
            _logger.LogWarning("Attempted to add a flight with a departure time in the past or now: {DepartureTime}", flightDto.DepartureTime);
            return false;
        }

        return true;
    }

}
