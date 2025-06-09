namespace isracard_fb_be.Interfaces.Repositories
{
    public interface IFlightRepository
    {
        Task<IEnumerable<Flight>> GetAllAsync();
        Task<Flight> GetByFlightNumberAsync(string flightNumber);
        Task AddAsync(Flight flight);
        void Remove(Flight flight);
        Task SaveChangesAsync();
    }
}
