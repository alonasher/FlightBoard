import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import type { Flight } from "../interfaces/flight";
import {
  validateFlightNumber,
  validateRequired,
  validateDeparture,
  validateFlightForm,
  validateGate,
} from "../helpers/inputValidators";
import {
  destinationFormatter,
  flightNumberFormatter,
  formatField,
} from "../helpers/inputFotmatters";

interface FlightFormProps {
  onAddFlight: (flight: Flight) => void;
}

const initialErrors = {
  flightNumber: null,
  destination: null,
  departure: null,
  gate: null,
};

const initialTouched = {
  flightNumber: false,
  destination: false,
  departure: false,
  gate: false,
};

const FlightForm = ({ onAddFlight }: FlightFormProps) => {
  // --- State ---
  const [flightNumber, setFlightNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [gate, setGate] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string | null }>(
    initialErrors
  );
  const [touched, setTouched] = useState<{ [k: string]: boolean }>(
    initialTouched
  );

  // --- Utils ---
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  // --- Handlers ---
  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    let error: string | null = null;

    switch (field) {
      case "flightNumber":
        formattedValue = flightNumberFormatter(value);
        setFlightNumber(formattedValue);
        error = validateFlightNumber(formattedValue);
        break;
      case "destination":
        formattedValue = destinationFormatter(value);
        setDestination(formattedValue);
        error = validateRequired(formattedValue, "Destination");
        break;
      case "departure":
        setDeparture(formattedValue);
        error = validateDeparture(formattedValue);
        break;
      case "gate":
        formattedValue = value.replace(/\s/g, "").toUpperCase();
        setGate(formattedValue);
        error = validateGate(formattedValue);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
    // Re-validate on blur
    handleChange(field, eval(field));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateFlightForm({
      flightNumber,
      destination,
      departure,
      gate,
    });

    setErrors(validation);
    setTouched({
      flightNumber: true,
      destination: true,
      departure: true,
      gate: true,
    });

    if (Object.values(validation).some((err) => !!err)) return;

    const cleanedFlightNumber = formatField("flightNumber", flightNumber, true);
    const cleanedDestination = formatField("destination", destination, true);
    const cleanedGate = formatField("gate", gate, true);

    onAddFlight({
      flightNumber: cleanedFlightNumber,
      destination: cleanedDestination,
      departureTime: new Date(departure).toISOString(),
      status: "Scheduled",
      gate: cleanedGate,
    });

    setFlightNumber("");
    setDestination("");
    setDeparture("");
    setGate("");
    setErrors(initialErrors);
    setTouched(initialTouched);
  };

  const isFormValid =
    flightNumber &&
    destination &&
    departure &&
    gate &&
    !errors.flightNumber &&
    !errors.destination &&
    !errors.departure &&
    !errors.gate;

  // --- Render ---
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mb: 2, display: "flex", gap: 2 }}
    >
      <TextField
        label="Flight Number"
        value={flightNumber}
        onChange={(e) => handleChange("flightNumber", e.target.value)}
        onBlur={() => handleBlur("flightNumber")}
        required
        error={!!errors.flightNumber && touched.flightNumber}
        helperText={touched.flightNumber ? errors.flightNumber : ""}
      />
      <TextField
        label="Destination"
        value={destination}
        onChange={(e) => handleChange("destination", e.target.value)}
        onBlur={() => handleBlur("destination")}
        required
        error={!!errors.destination && touched.destination}
        helperText={touched.destination ? errors.destination : ""}
      />
      <TextField
        label="Departure"
        type="datetime-local"
        value={departure}
        onChange={(e) => handleChange("departure", e.target.value)}
        onBlur={() => handleBlur("departure")}
        required
        error={!!errors.departure && touched.departure}
        helperText={touched.departure ? errors.departure : ""}
        slotProps={{
          htmlInput: {
            min: getMinDateTime(),
          },
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <TextField
        label="Gate"
        value={gate}
        onChange={(e) => handleChange("gate", e.target.value)}
        onBlur={() => handleBlur("gate")}
        required
        error={!!errors.gate && touched.gate}
        helperText={touched.gate ? errors.gate : ""}
      />
      <Button type="submit" variant="contained" disabled={!isFormValid}>
        Add Flight
      </Button>
    </Box>
  );
};

export default FlightForm;
