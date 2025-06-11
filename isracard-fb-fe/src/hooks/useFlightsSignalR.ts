import { useEffect } from "react";
import type { Flight, FlightStatus } from "../interfaces/flight";
import { useSignalR } from "../context/signalRProvider";
import { convertStatusCodeToStatus } from "../helpers/convertors";

type FlightsAction =
  | { type: "ADD_FLIGHT"; payload: Flight }
  | { type: "DELETE_FLIGHT"; payload: string }
  | { type: "UPDATE_FLIGHT_STATUS"; payload: { flightNumber: string; updatedStatus: FlightStatus } };

export const useFlightSignalR = (dispatch: React.Dispatch<FlightsAction>) => {
  const connection = useSignalR();

  useEffect(() => {
    if (!connection) return;

    const handleStatusUpdate = (flightNumber: string, updatedStatus: FlightStatus) => {
      dispatch({ type: "UPDATE_FLIGHT_STATUS", payload: { flightNumber, updatedStatus } });
    };
    const handleFlightAdded = (flight: Flight) => {
      flight.departureTime = new Date(flight.departureTime).toLocaleString('he-IL', {});
      flight.status = convertStatusCodeToStatus(flight.status.toString());
      dispatch({ type: "ADD_FLIGHT", payload: flight });
    };
    const handleFlightDeleted = (flightNumber: string) => {
      dispatch({ type: "DELETE_FLIGHT", payload: flightNumber });
    };

    connection.on("ReceiveFlightStatusUpdate", handleStatusUpdate);
    connection.on("ReceiveFlightAdded", handleFlightAdded);
    connection.on("ReceiveFlightDeleted", handleFlightDeleted);

    return () => {
      connection.off("ReceiveFlightStatusUpdate", handleStatusUpdate);
      connection.off("ReceiveFlightAdded", handleFlightAdded);
      connection.off("ReceiveFlightDeleted", handleFlightDeleted);
    };
  }, [connection, dispatch]);
};