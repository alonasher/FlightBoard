using System;
using System.ComponentModel.DataAnnotations;

public class FutureDepartureTimeAttribute : ValidationAttribute
{
    public int MinimumMinutesAhead { get; set; } = 60;

    public FutureDepartureTimeAttribute() : base("Departure time must be at least one hour ahead.")
    {
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is DateTime departureTime)
        {
            if (departureTime <= DateTime.UtcNow.AddMinutes(MinimumMinutesAhead))
            {
                return new ValidationResult(ErrorMessage ?? $"Departure time must be at least {MinimumMinutesAhead / 60} hour(s) ahead.");
            }
        }
        return ValidationResult.Success;
    }
}
