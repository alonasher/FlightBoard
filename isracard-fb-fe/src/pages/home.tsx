import { useEffect, useReducer, useState } from "react";
import type { Flight } from "../interfaces/flight";
import { FlightForm, FlightTable, FlightFilter } from "../components";
import { getFlights, addFlight, deleteFlight } from "../apis/flightsApi";
import type { FlightFilterOptions } from "../interfaces/flightFilter";
import { useFlightSignalR } from "../hooks/useFlightsSignalR";
import type { FlightsAction } from "../types/flightsAction";
import { flightsReducer } from "../services/flightsReducer";
import { Box, styled, Typography } from "@mui/material";

const StyledBoxContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
}));

const StlyedTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  fontWeight: 400,
  transition: "font-size 0.3s ease-in-out",
  [theme.breakpoints.down("md")]: {
    fontSize: "4rem",
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2.5rem",
    marginBottom: theme.spacing(3),
  },
}));

const FormStyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(5),
  width: "100%",
}));

interface HomeProps {}

const Home = (props: HomeProps) => {
  const [flights, dispatch] = useReducer(flightsReducer, []);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filter, setFilter] = useState<FlightFilterOptions>({
    status: "",
    destination: "",
  });
  const [lastAddedFlightNumber, setLastAddedFlightNumber] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [glowingFlights, setGlowingFlights] = useState<string[]>([]);

  useFlightSignalR((action: FlightsAction) => {
    if (action.type === "BATCH_UPDATE_FLIGHT_STATUS") {
      setGlowingFlights(action.payload.map((u) => u.flightNumber));
      setTimeout(() => setGlowingFlights([]), 750);
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
    <StyledBoxContainer>
      <StlyedTitle variant="h1">Flight Board</StlyedTitle>
      <FormStyledBox>
        <FlightForm onAddFlight={handleAddFlight} />
      </FormStyledBox>
      <FlightFilter onFilterChange={handleFilter} flights={allFlights} />
      <FlightTable
        flights={flights}
        handleDeleteFlight={handleDeleteFlight}
        lastAddedFlightNumber={lastAddedFlightNumber}
        glowingFlights={glowingFlights}
      />
    </StyledBoxContainer>
  );
};

export default Home;
