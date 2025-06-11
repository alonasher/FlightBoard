import { useEffect, useReducer, useState } from "react";
import type { Flight, FlightStatus } from "../interfaces/flight";
import { FlightForm, FlightTable } from "../components";
import { getFlights, addFlight, deleteFlight } from "../apis/flightsApi";
import FlightFilter from "../components/flightFilter";
import type { FlightFilterOptions } from "../interfaces/flightFilter";
import { convertStatusCodeToStatus } from "../helpers/convertors";
import { useFlightSignalR } from "../hooks/useFlightsSignalR";

interface HomeProps {}

type FlightsAction =
  | { type: "SET_FLIGHTS"; payload: Flight[] }
  | { type: "ADD_FLIGHT"; payload: Flight }
  | { type: "DELETE_FLIGHT"; payload: string }
  | { type: "UPDATE_FLIGHT_STATUS"; payload: {flightNumber : string,updatedStatus: FlightStatus} };

const flightsReducer = (state: Flight[], action: FlightsAction): Flight[] => {
  switch (action.type) {
    case "SET_FLIGHTS":
      return action.payload;
    case "ADD_FLIGHT":
      return [...state, action.payload];
    case "DELETE_FLIGHT":
      return state.filter((flight) => flight.flightNumber !== action.payload);
    case "UPDATE_FLIGHT_STATUS":
      return state.map((flight) =>
        flight.flightNumber === action.payload.flightNumber
          ? { ...flight, status: action.payload.updatedStatus }
          : flight
      );
    default:
      return state;
  }
};

const Home = (props: HomeProps) => {
  const [flights, dispatch] = useReducer(flightsReducer, []);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filter, setFilter] = useState<FlightFilterOptions>({
    status: "",
    destination: "",
  });

  useFlightSignalR(dispatch);

  // Fetch all flights on mount
  useEffect(() => {
    const fetchAllFlights = async () => {
      const flightsData = await getFlights({});
      setAllFlights(flightsData);
      dispatch({ type: "SET_FLIGHTS", payload: flightsData });
    };
    fetchAllFlights();
  }, []);

  useEffect(() => {
    const fetchFlights = async () => {
      const flightsData = await getFlights(filter);
      dispatch({ type: "SET_FLIGHTS", payload: flightsData });
    };

    fetchFlights();
  }, [filter]);

  // Handler for adding a flight
  const handleAddFlight = async (flightData: Flight) => {
    await addFlight(flightData);
  };

  // Handler for deleting a flight
  const handleDeleteFlight = async (flightNumber: string) => {
    await deleteFlight(flightNumber);
  };

  // Handler for filtering flights
  const handleFilter = async (filter: FlightFilterOptions) => {
    setFilter(filter);
  };

  return (
    <div>
      <h1>Flight Management</h1>
      <FlightForm onAddFlight={handleAddFlight} />
      <FlightFilter onFilterChange={handleFilter} flights={allFlights} />
      <FlightTable flights={flights} handleDeleteFlight={handleDeleteFlight} />
    </div>
  );
};

export default Home;
