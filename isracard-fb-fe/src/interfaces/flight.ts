export type FlightStatus =
  | "Scheduled"
  | "Boarding"
  | "Departed"
  | "Landed"
  | "Delayed";


export interface Flight {
  flightNumber: string;
  status: FlightStatus;
  destination: string;
  departureTime: string;
  gate: string;
}
