import React, { forwardRef } from "react";
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
  type TableRowProps,
} from "@mui/material";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import type { Flight } from "../../interfaces/flight";
import "./FlightTable.css"; // Create this file for animation styles

const TransitionTableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (props, ref) => <TableRow ref={ref} {...props} />
);

interface FlightTableProps {
  flights: Flight[];
  handleDeleteFlight: (flightNumber: string) => void;
  lastAddedFlight?: string;
}

const FlightTable = (props: FlightTableProps) => {
  const { flights, handleDeleteFlight, lastAddedFlight } = props;

  const upperCaseSx: SxProps = {
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
          <TransitionGroup component={React.Fragment}>
            {flights.map((flight) => (
              <CSSTransition
                key={flight.flightNumber + flight.status}
                timeout={500}
                classNames="fade"
              >
                <TransitionTableRow>
                  <TableCell sx={upperCaseSx}>
                    {flight.flightNumber.replace(
                      /^([A-Za-z]{2})(\d{4})$/,
                      "$1 $2"
                    )}
                  </TableCell>
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
                </TransitionTableRow>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FlightTable;
