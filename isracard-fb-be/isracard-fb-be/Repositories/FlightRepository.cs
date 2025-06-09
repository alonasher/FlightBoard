using isracard_fb_be.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

public class FlightRepository : IFlightRepository
{
    private readonly AppDbContext _context;

    public FlightRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Flight>> GetAllAsync() => await _context.Flights.ToListAsync();

    public async Task<Flight?> GetByFlightNumberAsync(string flightNumber) =>
        await _context.Flights.FirstOrDefaultAsync(f => f.FlightNumber.ToLower() == flightNumber.ToLower());

    public async Task AddAsync(Flight entity) => await _context.Flights.AddAsync(entity);

    public void Remove(Flight entity) => _context.Flights.Remove(entity);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
