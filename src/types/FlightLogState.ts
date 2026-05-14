import type { FlightLogEntry } from "./FlightLogEntry";

export type FlightLogState = {
  flights: FlightLogEntry[];
  status: "idle" | "loading" | "saving" | "error";
  errorMessage: string | null;
};
