import React, { useState, useMemo } from "react";
import { Select, MenuItem, Button, Box } from "@mui/material";
import type { FlightStatus, Flight } from "../interfaces/flight";
import type { FlightFilterOptions } from "../interfaces/flightFilter";

const flightStatusesDropdownData: {
  value: FlightStatus | "";
  label: string;
}[] = [
  { value: "", label: "All" },
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
    <Box onSubmit={handleOnSubmit} component="form" sx={{ mb: 2, display: "flex", gap: 2 }}>
      <Select label="Status" value={status} onChange={handleStatusChange} sx={{ minWidth: "140px" }} displayEmpty>
        {flightStatusesDropdownData.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <Select
        label="Destination"
        value={destination}
        onChange={handleDestinationChange}
        sx={{ minWidth: "140px" }}
        displayEmpty
      >
        <MenuItem value="">All</MenuItem>
        {destinations.map((dest) => (
          <MenuItem key={dest} value={dest} sx={{ textTransform: "capitalize" }}>
            {dest}
          </MenuItem>
        ))}
      </Select>
      <Button type="submit" variant="contained">
        Filter
      </Button>
      <Button type="button" variant="outlined" onClick={handleClear}>
        Clear
      </Button>
    </Box>
  );
};

export default FlightFilter;
