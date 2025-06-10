using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using isracard_fb_be.Interfaces.Repositories;
using isracard_fb_be.Interfaces.Services;
using isracard_fb_be.Enums;

public class FlightServiceTests
{
    private readonly Mock<IFlightRepository> _repoMock = new();
    private readonly Mock<IFlightStatusService> _statusServiceMock = new();
    private readonly Mock<ILogger<FlightService>> _loggerMock = new();

    private FlightService CreateService() =>
        new FlightService(_repoMock.Object, _statusServiceMock.Object, _loggerMock.Object);

    [Fact]
    public async Task AddFlightAsync_ShouldNotifyClients_WhenFlightIsAdded()
    {
        // Arrange
        var flightDto = new FlightDto
        {
            FlightNumber = "AB1234",
            Destination = "Paris",
            DepartureTime = DateTime.UtcNow.AddHours(2),
            Gate = "A1",
            Status = FlightStatus.Scheduled
        };

        _repoMock.Setup(r => r.AddAsync(It.IsAny<Flight>())).Returns(Task.CompletedTask);
        _repoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var service = CreateService();

        // Act
        await service.AddFlightAsync(flightDto);

        // Assert
        _statusServiceMock.Verify(s => s.NotifyFlightAdded(It.Is<FlightDto>(f => f.FlightNumber == "AB1234")), Times.Once);
    }

    [Fact]
    public async Task DeleteFlightAsync_ShouldNotifyClients_WhenFlightIsDeleted()
    {
        // Arrange
        var flight = new Flight
        {
            FlightNumber = "CD5678",
            Destination = "London",
            DepartureTime = DateTime.UtcNow.AddHours(3),
            Gate = "B2",
            Status = FlightStatus.Scheduled
        };

        _repoMock.Setup(r => r.GetByFlightNumberAsync("CD5678")).ReturnsAsync(flight);
        _repoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var service = CreateService();

        // Act
        await service.DeleteFlightAsync("CD5678");

        // Assert
        _statusServiceMock.Verify(s => s.NotifyFlightDeleted("CD5678"), Times.Once);
    }

    [Fact]
    public async Task AddFlightAsync_ShouldNotNotify_WhenFlightDtoIsNull()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.AddFlightAsync(null);

        // Assert
        _statusServiceMock.Verify(s => s.NotifyFlightAdded(It.IsAny<FlightDto>()), Times.Never);
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteFlightAsync_ShouldNotNotify_WhenFlightNotFound()
    {
        // Arrange
        _repoMock.Setup(r => r.GetByFlightNumberAsync("ZZ9999")).ReturnsAsync((Flight)null);

        var service = CreateService();

        // Act
        var result = await service.DeleteFlightAsync("ZZ9999");

        // Assert
        _statusServiceMock.Verify(s => s.NotifyFlightDeleted(It.IsAny<string>()), Times.Never);
        Assert.False(result);
    }
}
