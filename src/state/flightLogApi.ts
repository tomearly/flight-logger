import type { FlightLogEntry } from "../types/FlightLogEntry";
import type { LogFlightRequest } from "../types/LogFlightRequest";

type JsonObject = Record<string, unknown>;

function getErrorMessage(responseBody: string, status: number): string {
  return `Flight log request failed. Status: ${status}. Response body: ${responseBody}`;
}

async function readErrorResponse(response: Response): Promise<string> {
  const responseBody: string = await response.text();

  return getErrorMessage(responseBody, response.status);
}

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

export async function fetchFlights(): Promise<FlightLogEntry[]> {
  const response: Response = await fetch("/api/flights");

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  const responseBody = (await response.json()) as unknown;
  const flights: FlightLogEntry[] = parseFlightLogEntries(responseBody);

  return flights;
}

export async function saveFlightHours(hours: number, tailNumber: string): Promise<FlightLogEntry> {
  const requestBody: LogFlightRequest = { hours, tailNumber };
  const response: Response = await fetch("/api/flights", {
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  const responseBody = (await response.json()) as unknown;
  const flight: FlightLogEntry = parseFlightLogEntry(responseBody);

  return flight;
}
