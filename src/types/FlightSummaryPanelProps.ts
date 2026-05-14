import { type FlightLogEntry } from "./FlightLogEntry";
import { type FlightSummary } from "./FlightSummary";

export type FlightSummaryPanelProps = {
  flights: FlightLogEntry[];
  summary: FlightSummary;
};