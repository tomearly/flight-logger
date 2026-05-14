import type { FlightLogEntry } from "../types/FlightLogEntry";

type LogFlightRequest = {
  hours: number;
  tailNumber: string;
};

function getErrorMessage(responseBody: string, status: number): string {
  return `Flight log request failed. Status: ${status}. Response body: ${responseBody}`;
}

async function readErrorResponse(response: Response): Promise<string> {
  const responseBody: string = await response.text();

  return getErrorMessage(responseBody, response.status);
}

export async function fetchFlights(): Promise<FlightLogEntry[]> {
  const response: Response = await fetch("/api/flights");

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  const flights: FlightLogEntry[] = await response.json();

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

  const flight: FlightLogEntry = await response.json();

  return flight;
}
