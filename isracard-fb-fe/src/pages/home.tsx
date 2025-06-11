import { useEffect, useReducer, useState } from "react";
import type { Flight } from "../interfaces/flight";
import { FlightForm, FlightTable, FlightFilter } from "../components";
import { getFlights, addFlight, deleteFlight } from "../apis/flightsApi";
import type { FlightFilterOptions } from "../interfaces/flightFilter";
import { useFlightSignalR } from "../hooks/useFlightsSignalR";
import type { FlightsAction } from "../types/flightsAction";
import { convertStatusCodeToStatus } from "../helpers/convertors";

interface HomeProps {}

const flightsReducer = (state: Flight[], action: FlightsAction): Flight[] => {
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

const Home = (props: HomeProps) => {
  const [flights, dispatch] = useReducer(flightsReducer, []);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filter, setFilter] = useState<FlightFilterOptions>({
    status: "",
    destination: "",
  });
  const [lastAddedFlightNumber, setLastAddedFlightNumber] =
    useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [glowingFlights, setGlowingFlights] = useState<string[]>([]);

  useFlightSignalR((action: FlightsAction) => {
    if (action.type === "BATCH_UPDATE_FLIGHT_STATUS") {
      setGlowingFlights(action.payload.map((u) => u.flightNumber));
      setTimeout(() => setGlowingFlights([]), 700);
    }
    dispatch(action);
  });

  // Fetch all flights on mount
  useEffect(() => {
    const fetchAllFlights = async () => {
      const flightsData = await getFlights({});
      setAllFlights(flightsData);
      dispatch({ type: "SET_FLIGHTS", payload: flightsData });
    };
    fetchAllFlights();
  }, [refreshKey]);

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
    setRefreshKey((k) => k + 1);
    setLastAddedFlightNumber(flightData.flightNumber);
    setTimeout(() => setLastAddedFlightNumber(""), 750);
  };

  // Handler for deleting a flight
  const handleDeleteFlight = async (flightNumber: string) => {
    await deleteFlight(flightNumber);
    setRefreshKey((k) => k + 1);
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
      <FlightTable
        flights={flights}
        handleDeleteFlight={handleDeleteFlight}
        lastAddedFlightNumber={lastAddedFlightNumber}
        glowingFlights={glowingFlights}
      />
    </div>
  );
};

export default Home;
