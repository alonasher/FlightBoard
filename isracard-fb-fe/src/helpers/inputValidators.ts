export const FLIGHT_NUMBER_REGEX = /^([A-Za-z]{2})(\d{4})$/;
export const GATE_REGEX = /^([A-Za-z])(\d)$/;

export const validateFlightNumber = (value: string) => {
  const cleaned = value.replace(/\s/g, "").toUpperCase();
  if (!cleaned) return "Flight number is required";
  if (!FLIGHT_NUMBER_REGEX.test(cleaned)) {
    return "Format must be two letters followed by four digits (e.g. AB 1234)";
  }
  return null;
};

export const validateGate = (value: string) => {
  const cleaned = value.replace(/\s/g, "").toUpperCase();
  if (!cleaned) return "Gate is required";
  if (!GATE_REGEX.test(cleaned)) {
    return "Gate format must be one letter and one digit (e.g. A 3)";
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string) => {
  return value.trim() ? null : `${fieldName} is required`;
};

export const validateDeparture = (departure: string) => {
  if (!departure) return "Departure time is required";
  const selected = new Date(departure);
  const now = new Date();
  now.setHours(now.getHours() + 1);
  if (selected < now) {
    return "Departure time must be at least 1 hour from now";
  }
  return null;
};

export const validateFlightForm = ({ flightNumber, destination, departure, gate, }: {
  flightNumber: string;
  destination: string;
  departure: string;
  gate: string;
}) => {
  return {
    flightNumber: validateFlightNumber(flightNumber),
    destination: validateRequired(destination, "Destination"),
    gate: validateGate(gate),
    departure: validateDeparture(departure),
  };
};
