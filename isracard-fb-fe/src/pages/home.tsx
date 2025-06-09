import { useEffect, useReducer, useState } from "react";
import type { Flight, FlightStatus } from "../interfaces/flight";
import { FlightForm, FlightTable } from "../components";
import { getFlights, addFlight, deleteFlight } from "../apis/flightsApi";
import FlightFilter from "../components/flightFilter";
import type { FlightFilterOptions } from "../interfaces/flightFilter";

const TWO_MINS_IN_MS = 120000; // 2 minutes in milliseconds

interface HomeProps {}

type FlightsAction =
  | { type: "SET_FLIGHTS"; payload: Flight[] }
  | { type: "ADD_FLIGHT"; payload: Flight }
  | { type: "DELETE_FLIGHT"; payload: string }

const flightsReducer = (state: Flight[], action: FlightsAction): Flight[] => {
  switch (action.type) {
    case "SET_FLIGHTS":
      return action.payload;
    case "ADD_FLIGHT":
      return [...state, action.payload];
    case "DELETE_FLIGHT":
      return state.filter((flight) => flight.flightNumber !== action.payload);     
    default:
      return state;
  }
};

const Home = (props: HomeProps) => {
  const [flights, dispatch] = useReducer(flightsReducer, []);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filter, setFilter] = useState<FlightFilterOptions>({status: "", destination: ""});

  useEffect(() => {
    const fetchAllFlights = async () => {
      const flightsData = await getFlights({});
      setAllFlights(flightsData);
    };
    fetchAllFlights();
  }, []);

  useEffect(() => {
    const fetchFlights = async () => {
      const flightsData = await getFlights(filter);
      dispatch({ type: "SET_FLIGHTS", payload: flightsData });
    };

    fetchFlights(); // Initial fetch

    const intervalId = setInterval(fetchFlights, TWO_MINS_IN_MS);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [filter]);

  // Handler for adding a flight
  const handleAddFlight = async (flightData: Flight) => {
    const created = await addFlight(flightData);
    dispatch({ type: "ADD_FLIGHT", payload: created });
  };

  // Handler for deleting a flight
  const handleDeleteFlight = async (flightNumber: string) => {
    await deleteFlight(flightNumber);
    dispatch({ type: "DELETE_FLIGHT", payload: flightNumber });
  };

  // Handler for filtering flights
  const handleFilter = async (filter: FlightFilterOptions) => {
    setFilter(filter);
  };

  return (
    <div>
      <h1>Flight Management</h1>
      <FlightForm onAddFlight={handleAddFlight} />
      <FlightFilter onFilterChange = {handleFilter} flights={allFlights}/>
      <FlightTable flights={flights} handleDeleteFlight={handleDeleteFlight} />
    </div>
  );
};

export default Home;
