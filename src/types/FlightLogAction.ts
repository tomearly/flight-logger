import type { FlightLogEntry } from "./FlightLogEntry";

export type FlightLogAction =
  | { type: "load-flights"; flights: FlightLogEntry[] }
  | { type: "start-loading" }
  | { type: "start-saving" }
  | { type: "log-flight"; flight: FlightLogEntry }
  | { type: "fail"; errorMessage: string };
