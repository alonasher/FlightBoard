import React, { useState } from "react";
import { Button, TextField, Box, styled } from "@mui/material";
import type { Flight } from "../interfaces/flight";
import {
  validateFlightNumber,
  validateRequired,
  validateDeparture,
  validateFlightForm,
  validateGate,
} from "../helpers/inputValidators";
import { destinationFormatter, flightNumberFormatter, formatField } from "../helpers/inputFotmatters";
import { width } from "@mui/system";

const StyledFormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  minHeight: 85,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: 215,
  [theme.breakpoints.down(1250)]: {
    width: "calc(50% - 12px)",
    flex: "1 1 45%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    flexBasis: "100%",
    minWidth: 0,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: 56,
  maxWidth: 610,
  minWidth: 150,
  [theme.breakpoints.down(1250)]: {
    flexGrow: 1,
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    flexBasis: "100%",
  },
}));

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
  const [errors, setErrors] = useState<{ [k: string]: string | null }>(initialErrors);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>(initialTouched);

  // --- Utils ---
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
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

    const valueMap: Record<string, string> = { flightNumber, destination, departure, gate };
    handleChange(field, valueMap[field]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateFlightForm({ flightNumber, destination, departure, gate });

    setErrors(validation);
    setTouched({ flightNumber: true, destination: true, departure: true, gate: true });

    if (Object.values(validation).some((err) => !!err)) return;

    const cleanedFlightNumber = formatField("flightNumber", flightNumber, true);
    const cleanedDestination = formatField("destination", destination, true);
    const cleanedGate = formatField("gate", gate, true);

    onAddFlight({
      flightNumber: cleanedFlightNumber,
      destination: cleanedDestination,
      departureTime: departure,
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
    <StyledFormContainer onSubmit={handleSubmit}>
      <StyledTextField
        label="Flight Number"
        placeholder="e.g. LY1234"
        value={flightNumber}
        onChange={(e) => handleChange("flightNumber", e.target.value)}
        onBlur={() => handleBlur("flightNumber")}
        required
        error={!!errors.flightNumber && touched.flightNumber}
        helperText={touched.flightNumber ? errors.flightNumber : ""}
      />
      <StyledTextField
        label="Destination"
        placeholder="e.g. Tel Aviv"
        value={destination}
        onChange={(e) => handleChange("destination", e.target.value)}
        onBlur={() => handleBlur("destination")}
        required
        error={!!errors.destination && touched.destination}
        helperText={touched.destination ? errors.destination : ""}
      />
      <StyledTextField
        label="Departure"
        type="datetime-local"
        placeholder="Select date and time"
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
      <StyledTextField
        label="Gate"
        placeholder="e.g. X3"
        value={gate}
        onChange={(e) => handleChange("gate", e.target.value)}
        onBlur={() => handleBlur("gate")}
        required
        error={!!errors.gate && touched.gate}
        helperText={touched.gate ? errors.gate : ""}
      />
      <StyledButton type="submit" variant="contained" disabled={!isFormValid}>
        Add
      </StyledButton>
    </StyledFormContainer>
  );
};

export default FlightForm;
