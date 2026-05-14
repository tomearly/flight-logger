import { useEffect, useMemo, useReducer } from "react";
import "./App.css";
import FlightLogForm from "./components/FlightLogForm";
import FlightSummaryPanel from "./components/FlightSummaryPanel";
import { fetchFlights, saveFlightHours } from "./state/flightLogApi";
import {
  createFlightSummary,
  flightLogReducer,
  initialFlightLogState
} from "./state/flightLogReducer";
import type { FlightSummary } from "./types/FlightSummary";
import type { FlightLogEntry } from "./types/FlightLogEntry";

export function App(): React.JSX.Element {
  const [state, dispatch] = useReducer(flightLogReducer, initialFlightLogState);
  const summary: FlightSummary = useMemo(() => createFlightSummary(state), [state]);

  const failError = function (error: unknown) {
    if (error instanceof Error) {
      dispatch({ errorMessage: error.message, type: "fail" });
      return;
    }

    throw error;
  };

  useEffect(() => {
    function loadFlights(): void {
      try {
        dispatch({ type: "start-loading" });

        const flights: FlightLogEntry[] = fetchFlights();

        dispatch({ flights, type: "load-flights" });
      } catch (error: unknown) {
        failError(error);
      }
    }

    loadFlights();
  }, []);

  function handleLogFlight(
    hours: number,
    tailNumber: string,
    fromICAO: string,
    toICAO: string
  ): void {
    try {
      dispatch({ type: "start-saving" });

      const flight: FlightLogEntry = saveFlightHours(hours, tailNumber, fromICAO, toICAO);

      dispatch({ flight, type: "log-flight" });
    } catch (error: unknown) {
      failError(error);
    }
  }

  return (
    <main className="app-shell">
      <section className="summary-panel" aria-labelledby="summary-heading">
        <p className="eyebrow"></p>
        <h1 id="summary-heading">Flight Logger</h1>
        <FlightSummaryPanel flights={state.flights} summary={summary} />
        <FlightLogForm isSaving={state.status === "saving"} onLogFlight={handleLogFlight} />
        {state.status === "loading" ? (
          <p className="status-message">Loading saved flights...</p>
        ) : null}
        {state.status === "error" && state.errorMessage !== null ? (
          <p className="form-error">{state.errorMessage}</p>
        ) : null}
      </section>
    </main>
  );
}
