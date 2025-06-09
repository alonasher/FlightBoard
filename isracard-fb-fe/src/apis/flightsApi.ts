import axios from "axios";
import type { Flight, FlightStatus } from "../interfaces/flight";
import type { FlightFilterOptions } from "../interfaces/flightFilter";

const API_BASE = "http://localhost:5256/api/flights";

export const getFlights = async (filter: FlightFilterOptions): Promise<Flight[]> => {
  const params: Record<string, string> = {};
  const { status, destination } = filter;
  if (status !== "" && status) params.status = status;
  if (destination) params.destination = destination;
  const response = await axios.get<Flight[]>(API_BASE, { params: filter });
  response.data.forEach((flight) => {
    flight.departureTime = new Date(flight.departureTime).toLocaleString();
    flight.status = convertStatusCodeToStatus(flight.status.toString());
  });
  return response.data;
};

export const addFlight = async (flight: Flight): Promise<Flight> => {
  const response = await axios.post<Flight>(API_BASE, {
    ...flight,
    status: convertStatusToCode(flight.status),
  });
  return response.data;
};

export const deleteFlight = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};

const convertStatusCodeToStatus = (statusCode: string): FlightStatus => {
  switch (statusCode) {
    case "0":
      return "Scheduled";
    case "1":
      return "Boarding";
    case "2":
      return "Departed";
    case "3":
      return "Landed";
    default:
      return "Delayed";
  }
};

const convertStatusToCode = (status: FlightStatus): number => {
  switch (status) {
    case "Scheduled":
      return 0;
    case "Boarding":
      return 1;
    case "Departed":
      return 2;
    case "Landed":
      return 3;
    default:
      return 4;
  }
};
