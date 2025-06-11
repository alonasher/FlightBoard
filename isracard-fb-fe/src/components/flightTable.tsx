import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  type SxProps,
  Fade,
  styled,
} from "@mui/material";
import type { Flight, FlightStatus } from "../interfaces/flight";

const StyledTableCell = styled(TableCell)(({}) => ({
  textTransform: "uppercase",
}));

const getStatusColor = (status: FlightStatus) => {
  switch (status) {
    case "Scheduled":
      return "#43a047";
    case "Delayed":
      return "#e53935";
    case "Boarding":
      return "#1e88e5";
    case "Departed":
      return "#757575";
    default:
      return "#fb8c00"; // Landed
  }
};

interface FlightTableProps {
  flights: Flight[];
  handleDeleteFlight: (flightNumber: string) => void;
  lastAddedFlightNumber?: string;
  glowingFlights?: string[];
}

const FlightTable = (props: FlightTableProps) => {
  const { flights, handleDeleteFlight, lastAddedFlightNumber, glowingFlights } = props;
  const [fadeInFlights, setFadeInFlights] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (lastAddedFlightNumber) {
      setFadeInFlights((prev) => ({
        ...prev,
        [lastAddedFlightNumber]: false,
      }));

      setTimeout(() => {
        setFadeInFlights((prev) => ({
          ...prev,
          [lastAddedFlightNumber]: true,
        }));
      }, 10);
    }
  }, [lastAddedFlightNumber]);

  const glowAnimation: SxProps = {
    animation: "glow 700ms ease-in-out",
    boxShadow: "0 0 10px 2px #ffd700",
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flight Number</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Departure Time</TableCell>
            <TableCell>Gate</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map((flight) => (
            <Fade
              in={lastAddedFlightNumber === flight.flightNumber ? fadeInFlights[flight.flightNumber] ?? true : true}
              timeout={700}
              key={flight.flightNumber + flight.status}
            >
              <TableRow
                key={flight.flightNumber + flight.status}
                sx={glowingFlights?.includes(flight.flightNumber) ? glowAnimation : {}}
              >
                <StyledTableCell>{flight.flightNumber.replace(/^([A-Za-z]{2})(\d{4})$/, "$1 $2")}</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, letterSpacing: 1 }}>{flight.destination}</StyledTableCell>
                <StyledTableCell>{flight.departureTime}</StyledTableCell>
                <StyledTableCell>{flight.gate}</StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: getStatusColor(flight.status),
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  {flight.status}
                </StyledTableCell>
                <StyledTableCell>
                  <Button color="error" variant="outlined" onClick={() => handleDeleteFlight(flight.flightNumber)}>
                    Delete
                  </Button>
                </StyledTableCell>
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FlightTable;
