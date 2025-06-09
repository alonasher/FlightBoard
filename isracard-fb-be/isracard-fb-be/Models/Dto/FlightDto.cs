using isracard_fb_be.Enums;
using System.ComponentModel.DataAnnotations;

public class FlightDto
{
    [Required]
    [MaxLength(6)]
    [RegularExpression(@"^([A-Za-z]{2})(\d{4})$", ErrorMessage = "Flight number must be in the format: two letters followed by four digits (e.g., AB1234).")]
    public string FlightNumber { get; set; }

    [Required]
    public string Destination { get; set; }

    [Required]
    [FutureDepartureTime(ErrorMessage = "Departure time must be at least one hour ahead.")]
    public DateTime DepartureTime { get; set; }

    [Required]
    [RegularExpression(@"^([A-Za-z])(\d)$", ErrorMessage = "Gate must be in the format: one letter followed by one digit (e.g., A1).")]
    public string Gate { get; set; }

    public FlightStatus Status { get; set; }
}
