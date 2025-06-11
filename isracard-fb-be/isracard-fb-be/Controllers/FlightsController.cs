using isracard_fb_be.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _service;

    public FlightsController(IFlightService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? status, [FromQuery] string? destination)
    {
        var flights = await _service.GetFilteredFlightsAsync(status, destination);
        return Ok(flights);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] FlightDto flight)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.AddFlightAsync(flight);
            return CreatedAtAction(nameof(Get), new { id = created.FlightNumber }, created);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _service.DeleteFlightAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
