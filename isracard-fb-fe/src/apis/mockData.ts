// import type { Flight } from "../interfaces/flight";

// function randomFlightNumber() {
//     const letters = String.fromCharCode(
//         65 + Math.floor(Math.random() * 26),
//         65 + Math.floor(Math.random() * 26)
//     );
//     const numbers = String(Math.floor(1000 + Math.random() * 9000));
//     return `${letters} ${numbers}`;
// }

// function randomGate() {
//     const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
//     const numbers = String(Math.floor(Math.random() * 10));
//     return `${letter} ${numbers}`;
// }

// const mockFlights: Flight[] = [
//     {
//         id: '1',
//         flightNumber: randomFlightNumber(),
//         status: 'On Time',
//         destination: 'New York',
//         departure: '2023-10-01T10:00:00Z',
//         gate: randomGate(),
//     },
//     {
//         id: '2',
//         flightNumber: randomFlightNumber(),
//         status: 'Delayed',
//         destination: 'Los Angeles',
//         departure: '2023-10-01T12:30:00Z',
//         gate: randomGate(),
//     },
//     {
//         id: '3',
//         flightNumber: randomFlightNumber(),
//         status: 'Cancelled',
//         destination: 'Chicago',
//         departure: '2023-10-01T15:00:00Z',
//         gate: randomGate(),
//     },
//     {
//         id: '4',
//         flightNumber: randomFlightNumber(),
//         status: 'On Time',
//         destination: 'Miami',
//         departure: '2023-10-01T17:45:00Z',
//         gate: randomGate(),
//     },
// ];

// export default mockFlights;