using isracard_fb_be.Interfaces.Repositories;
using isracard_fb_be.Interfaces.Services;
using Microsoft.EntityFrameworkCore;
using isracard_fb_be.Enums;

public class FlightService : IFlightService
{
    private readonly IFlightRepository _repo;
    private readonly ILogger<FlightService> _logger;

    public FlightService(IFlightRepository repo, ILogger<FlightService> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    public async Task<IEnumerable<FlightDto>> GetAllFlightsAsync()
    {
        try
        {
            var flights = (await _repo.GetAllAsync()).ToList();
            foreach (var flight in flights)
            {
                var newStatus = CalculateStatus(flight.DepartureTime);
                if (flight.Status != newStatus)
                {
                    flight.Status = newStatus;
                }
            }
            await _repo.SaveChangesAsync();
            return flights.Select(MapToDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all flights.");
            return Enumerable.Empty<FlightDto>();
        }
    }

    public async Task<FlightDto> GetByFlightNumberAsync(string flightNumber)
    {
        try
        {
            var flight = await _repo.GetByFlightNumberAsync(flightNumber);
            if (flight != null)
            {
                var newStatus = CalculateStatus(flight.DepartureTime);
                if (flight.Status != newStatus)
                {
                    flight.Status = newStatus;
                    await _repo.SaveChangesAsync();
                }
                return MapToDto(flight);
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving flight with ID {FlightId}.", flightNumber);
            return null;
        }
    }

    public async Task<FlightDto> AddFlightAsync(FlightDto flightDto)
    {
        try
        {
            if (flightDto == null)
            {
                _logger.LogWarning("Attempted to add a null flight.");
                return null;
            }

            if (flightDto.DepartureTime <= DateTime.UtcNow)
            {
                _logger.LogWarning("Attempted to add a flight with a departure time in the past or now: {DepartureTime}", flightDto.DepartureTime);
                return null;
            }

            var flight = MapToEntity(flightDto);
            flight.Status = CalculateStatus(flight.DepartureTime);

            await _repo.AddAsync(flight);
            await _repo.SaveChangesAsync();
            _logger.LogInformation("Flight with number {FlightNumber} added successfully.", flightDto.FlightNumber);
            return MapToDto(flight);
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

            return filtered.Select(MapToDto).ToList();
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
        var now = DateTime.UtcNow;
        var diff = (departureTime - now).TotalMinutes;
        if (diff > 30) return FlightStatus.Scheduled;
        if (diff > 10) return FlightStatus.Boarding;
        if (diff >= -60) return FlightStatus.Departed;
        if (diff < -60) return FlightStatus.Landed;
        if (diff < -15) return FlightStatus.Delayed;
        return FlightStatus.Scheduled;
    }

    private FlightDto MapToDto(Flight flight)
    {
        if (flight == null) return null;
        return new FlightDto
        {
            FlightNumber = flight.FlightNumber,
            Destination = flight.Destination,
            DepartureTime = flight.DepartureTime,
            Gate = flight.Gate,
            Status = flight.Status
        };
    }

    private Flight MapToEntity(FlightDto dto)
    {
        if (dto == null) return null;
        return new Flight
        {
            FlightNumber = dto.FlightNumber,
            Destination = dto.Destination,
            DepartureTime = dto.DepartureTime,
            Gate = dto.Gate,
            Status = dto.Status
        };
    }
}
