import type { FlightStatus } from "../interfaces/flight";

export const convertStatusCodeToStatus = (statusCode: string): FlightStatus => {
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

export const convertStatusToCode = (status: FlightStatus): number => {
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
