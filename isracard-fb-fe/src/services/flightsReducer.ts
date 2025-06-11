import type { Flight } from "../interfaces/flight";
import type { FlightsAction } from "../types/flightsAction";
import { convertStatusCodeToStatus } from "../helpers/convertors";

export const flightsReducer = (state: Flight[], action: FlightsAction): Flight[] => {
   switch (action.type) {
    case "SET_FLIGHTS":
      return action.payload;
    case "ADD_FLIGHT":
      return [...state, action.payload].sort(
        (a, b) =>
          new Date(a.departureTime).getTime() -
          new Date(b.departureTime).getTime()
      );
    case "DELETE_FLIGHT":
      return state.filter((flight) => flight.flightNumber !== action.payload);
    case "BATCH_UPDATE_FLIGHT_STATUS":
      return state.map((flight) => {
        const update = action.payload.find(
          (u) => u.flightNumber === flight.flightNumber
        );
        return update
          ? {
              ...flight,
              status: convertStatusCodeToStatus(
                update.status.toString()
              ),
            }
          : flight;
      });
    default:
      return state;
  }
};