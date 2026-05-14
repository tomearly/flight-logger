import type { FlightLogState } from "../types/FlightLogState";
import type { FlightLogAction } from "../types/FlightLogAction";
import type { FlightSummary } from "../types/FlightSummary";

export const initialFlightLogState: FlightLogState = {
  flights: [],
  status: "idle",
  errorMessage: null
};

export function flightLogReducer(state: FlightLogState, action: FlightLogAction): FlightLogState {
  switch (action.type) {
    case "load-flights": {
      return {
        flights: action.flights,
        status: "idle",
        errorMessage: null
      };
    }

    case "start-loading": {
      return {
        ...state,
        status: "loading",
        errorMessage: null
      };
    }

    case "start-saving": {
      return {
        ...state,
        status: "saving",
        errorMessage: null
      };
    }

    case "log-flight": {
      return {
        flights: [...state.flights, action.flight],
        status: "idle",
        errorMessage: null
      };
    }

    case "fail": {
      return {
        ...state,
        status: "error",
        errorMessage: action.errorMessage
      };
    }
  }
}

export function createFlightSummary(state: FlightLogState): FlightSummary {
  const totalHours: number = state.flights.reduce(
    (currentTotal: number, flight) => currentTotal + flight.hours,
    0
  );

  return {
    totalFlights: state.flights.length,
    totalHours,
    nextAction: state.flights.length === 0 ? "Log your first flight" : "Log another flight"
  };
}
