import type { FlightLogEntry } from "../types/FlightLogEntry";
import type { FlightSummaryPanelProps } from "../types/FlightSummaryPanelProps";
import { formatLoggedAt } from "../libs/utils";

function FlightSummaryPanel(props: FlightSummaryPanelProps): React.JSX.Element {
  const recentFlights: FlightLogEntry[] = props.flights.slice(-5).reverse();

  return (
    <>
      <dl className="stats-grid">
        <div>
          <dt>Flights</dt>
          <dd>{props.summary.totalFlights}</dd>
        </div>
        <div>
          <dt>Hours</dt>
          <dd>{props.summary.totalHours.toFixed(1)}</dd>
        </div>
      </dl>
      <p className="next-action">{props.summary.nextAction}</p>
      <section className="recent-flights" aria-labelledby="recent-flights-heading">
        <h2 id="recent-flights-heading">Recent flights</h2>
        {recentFlights.length === 0 ? (
          <p className="empty-state">No flight hours logged yet.</p>
        ) : (
          <ul>
            {recentFlights.map((flight) => (
              <li key={flight.id}>
                <span>{flight.hours.toFixed(1)} hours</span>
                <span>{flight.tailNumber}</span>
                <time dateTime={flight.loggedAt}>{formatLoggedAt(flight.loggedAt)}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default FlightSummaryPanel;
