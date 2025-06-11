using isracard_fb_be.Enums;
using System.ComponentModel.DataAnnotations;

public class Flight
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(6)]
    public string FlightNumber { get; set; }

    [Required]
    public string Destination { get; set; }

    [Required]
    public DateTime DepartureTime { get; set; }

    [Required]
    public string Gate { get; set; }

    public FlightStatus Status { get; set; }
}
