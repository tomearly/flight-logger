import type { FlightLogEntry } from "../types/FlightLogEntry";

type JsonObject = Record<string, unknown>;

const flightLogStorageKey = "flight-logger:flights";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseFlightLogEntry(value: unknown): FlightLogEntry {
  if (
    !isJsonObject(value) ||
    typeof value.id !== "string" ||
    typeof value.hours !== "number" ||
    !Number.isFinite(value.hours) ||
    typeof value.loggedAt !== "string" ||
    typeof value.tailNumber !== "string"
  ) {
    throw new Error(`Expected flight log entry response. Body: ${JSON.stringify(value)}`);
  }

  return {
    hours: value.hours,
    id: value.id,
    loggedAt: value.loggedAt,
    tailNumber: value.tailNumber
  };
}

function parseFlightLogEntries(value: unknown): FlightLogEntry[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected flight log entries response. Body: ${JSON.stringify(value)}`);
  }

  return value.map(parseFlightLogEntry);
}

function readFlightsFromStorage(): FlightLogEntry[] {
  const storedFlights: string | null = window.localStorage.getItem(flightLogStorageKey);

  if (storedFlights === null) {
    return [];
  }

  const parsedFlights: unknown = JSON.parse(storedFlights);

  return parseFlightLogEntries(parsedFlights);
}

function writeFlightsToStorage(flights: FlightLogEntry[]): void {
  window.localStorage.setItem(flightLogStorageKey, JSON.stringify(flights));
}

function createFlight(hours: number, tailNumber: string): FlightLogEntry {
  return {
    hours,
    id: crypto.randomUUID(),
    loggedAt: new Date().toISOString(),
    tailNumber
  };
}

export function fetchFlights(): FlightLogEntry[] {
  return readFlightsFromStorage();
}

export function saveFlightHours(hours: number, tailNumber: string): FlightLogEntry {
  const flight: FlightLogEntry = createFlight(hours, tailNumber);
  const flights: FlightLogEntry[] = readFlightsFromStorage();

  writeFlightsToStorage([...flights, flight]);
  return flight;
}
