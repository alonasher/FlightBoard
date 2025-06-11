import type { Flight, FlightStatusUpdate } from "../interfaces/flight";

export type FlightsAction =
  | { type: "SET_FLIGHTS"; payload: Flight[] }
  | { type: "ADD_FLIGHT"; payload: Flight }
  | { type: "DELETE_FLIGHT"; payload: string }
  | { type: "BATCH_UPDATE_FLIGHT_STATUS"; payload: FlightStatusUpdate[] };