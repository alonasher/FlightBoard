import { FLIGHT_NUMBER_REGEX } from "./inputValidators";

export const flightNumberFormatter = (value: string) => {
  let cleaned = value.replace(/\s/g, "").toUpperCase();
  if (FLIGHT_NUMBER_REGEX.test(cleaned)) {
    cleaned = cleaned.replace(FLIGHT_NUMBER_REGEX, "$1 $2");
  }
  return cleaned;
};

export const destinationFormatter = (value: string) => {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatField = ( field: string, value: string, toLower: boolean = false ) => {
  let formatted = value;
  switch (field) {
    case "flightNumber":
      formatted = value.replace(/\s/g, "");
      formatted = toLower ? formatted.toLowerCase() : formatted.toUpperCase();
      break;
    case "destination":
      formatted = destinationFormatter(value);
      formatted = toLower ? formatted.toLowerCase() : formatted;
      break;
    case "gate":
      formatted = value.replace(/\s/g, "");
      formatted = toLower ? formatted.toLowerCase() : formatted.toUpperCase();
      break;
    default:
      formatted = toLower ? value.toLowerCase() : value;
      break;
  }
  return formatted;
};
