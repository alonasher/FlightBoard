import React from "react";
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
} from "@mui/material";
import type { Flight } from "../interfaces/flight";

interface FlightTableProps {
  flights: Flight[];
  handleDeleteFlight: (flightNumber: string) => void;
}

const FlightTable = (props: FlightTableProps) => {
  const { flights, handleDeleteFlight } = props;

  const upperCaseSx :SxProps = {
    textTransform: "uppercase",
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
          {flights.map((flight, index) => (
            <TableRow key={flight.flightNumber + index}>
              <TableCell sx={upperCaseSx}>{flight.flightNumber.replace(/^([A-Za-z]{2})(\d{4})$/, "$1 $2")}</TableCell>
              <TableCell sx={upperCaseSx}>{flight.destination}</TableCell>
              <TableCell sx={upperCaseSx}>{flight.departureTime}</TableCell>
              <TableCell sx={upperCaseSx}>{flight.gate}</TableCell>
              <TableCell sx={upperCaseSx}>{flight.status}</TableCell>
              <TableCell>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => handleDeleteFlight(flight.flightNumber)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FlightTable;
