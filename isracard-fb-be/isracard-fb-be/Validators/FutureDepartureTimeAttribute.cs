using System.ComponentModel.DataAnnotations;

public class FutureDepartureTimeAttribute : ValidationAttribute
{
    public int MinimumMinutesAhead { get; set; } = 10;

    public FutureDepartureTimeAttribute() : base("Departure time must be at least 10 mins ahead.")
    {
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is DateTime departureTime)
        {
            if (departureTime <= DateTime.UtcNow.AddMinutes(MinimumMinutesAhead))
            {
                return new ValidationResult(ErrorMessage ?? $"Departure time must be at least {MinimumMinutesAhead} min(s) ahead.");
            }
        }
        return ValidationResult.Success;
    }
}
