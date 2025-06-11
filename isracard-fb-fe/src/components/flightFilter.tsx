import React, { useState, useMemo } from "react";
import { Select, MenuItem, Button, Box, styled } from "@mui/material";
import type { FlightStatus, Flight } from "../interfaces/flight";
import type { FlightFilterOptions } from "../interfaces/flightFilter";

const StyledFilterBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
  },
}));

const Row = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    ["& > *"]: {
      width: "calc(50% - 12px)",
      flex: "1 1 45%",
    }
  },
}));

const flightStatusesDropdownData: {
  value: FlightStatus | "";
  label: string;
}[] = [
  { value: "", label: "Status" },
  { value: "Boarding", label: "Boarding" },
  { value: "Delayed", label: "Delayed" },
  { value: "Departed", label: "Departed" },
  { value: "Landed", label: "Landed" },
  { value: "Scheduled", label: "Scheduled" },
];

interface FlightFilterProps {
  onFilterChange: (filter: FlightFilterOptions) => void;
  flights: Flight[];
}

const FlightFilter = (props: FlightFilterProps) => {
  const { onFilterChange, flights } = props;

  const [status, setStatus] = useState("");
  const [destination, setDestination] = useState("");

  const destinations = useMemo(() => {
    const destSet = new Set<string>();
    flights.forEach((f) => destSet.add(f.destination));
    return Array.from(destSet);
  }, [flights]);

  const handleStatusChange = (event: any) => {
    const newStatus = event.target.value as string;
    setStatus(newStatus);
  };

  const handleDestinationChange = (event: any) => {
    const newDestination = event.target.value;
    setDestination(newDestination);
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onFilterChange({ status, destination });
  };

  const handleClear = () => {
    setStatus("");
    setDestination("");
    onFilterChange({ status: "", destination: "" });
  };

  return (
    <StyledFilterBox onSubmit={handleOnSubmit}>
      <Row>
        <Select value={status} onChange={handleStatusChange} sx={{ minWidth: "140px" }} displayEmpty>
          {flightStatusesDropdownData.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <Select value={destination} onChange={handleDestinationChange} sx={{ minWidth: "140px" }} displayEmpty>
          <MenuItem value="">Destination</MenuItem>
          {destinations.map((dest) => (
            <MenuItem key={dest} value={dest} sx={{ textTransform: "capitalize" }}>
              {dest}
            </MenuItem>
          ))}
        </Select>
      </Row>
      <Row>
        <Button variant="contained" onClick={handleOnSubmit} sx={{ minHeight: 56 }}>
          Filter
        </Button>
        <Button type="button" variant="outlined" onClick={handleClear} sx={{ minHeight: 56 }}>
          Clear
        </Button>
      </Row>
    </StyledFilterBox>
  );
};

export default FlightFilter;
