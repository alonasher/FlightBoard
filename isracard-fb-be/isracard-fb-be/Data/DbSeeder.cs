// Data/DbSeeder.cs
using isracard_fb_be.Enums;
using System;
using System.Linq;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Flights.Any())
        {
            var random = new Random();
            var destinations = new[] { "London", "Paris", "New York", "Berlin", "Tokyo" };
            var gates = new[] { "A1", "B2", "C3", "D4", "E5" };
            var statuses = Enum.GetValues(typeof(FlightStatus)).Cast<FlightStatus>().ToArray();

            for (int i = 0; i < 10; i++)
            {
                var flight = new Flight
                {
                    Id = Guid.NewGuid(),
                    FlightNumber = $"FN{random.Next(1000, 9999)}",
                    Destination = destinations[random.Next(destinations.Length)],
                    DepartureTime = DateTime.UtcNow.AddHours(random.Next(1, 48)),
                    Gate = gates[random.Next(gates.Length)],
                    Status = statuses[random.Next(statuses.Length)]
                };
                context.Flights.Add(flight);
            }
            context.SaveChanges();
        }
    }
}
