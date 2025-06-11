namespace isracard_fb_be.Helpers
{
    public static class FlightMappingService
    {
        public static FlightDto MapToDto(Flight flight)
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

        public static  Flight MapToEntity(FlightDto dto)
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
}
