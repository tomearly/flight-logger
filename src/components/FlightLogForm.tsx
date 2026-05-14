import { type FlightLogFormProps } from "../types/FlightLogFormProps";
import { useFlightLogForm } from "../hooks/useFlightLogForm";

function FlightLogForm(props: FlightLogFormProps): React.JSX.Element {
  const form = useFlightLogForm({
    onLogFlight: props.onLogFlight
  });

  return (
    <form
      className="flight-form"
      onSubmit={(event) => {
        form.handleSubmit(event);
      }}
    >
      <label htmlFor="hours">Hours</label>
      <div className="flight-form-row">
        <input
          id="hours"
          min="0.1"
          onChange={(event) => {
            form.handleHoursChange(event.target.value);
          }}
          step="0.1"
          type="number"
          value={form.hours}
        />
      </div>
      <label htmlFor="tailNumber">Tail Number</label>
      <div className="flight-form-row">
        <input
          id="tailNumber"
          onChange={(event) => {
            form.handleTailNumberChange(event.target.value);
          }}
          type="text"
          placeholder="e.g. G-TOME"
          value={form.tailNumber}
        />
      </div>
      <label htmlFor="fromICAO">From ICAO</label>
      <div className="flight-form-row">
        <input
          id="fromICAO"
          onChange={(event) => {
            form.handleFromDestinationICAO(event.target.value);
          }}
          placeholder="e.g. EHAM"
          type="text"
        />
      </div>
      <label htmlFor="toICAO">To ICAO</label>
      <div className="flight-form-row">
        <input
          id="toICAO"
          onChange={(event) => {
            form.handleToDestinationICAO(event.target.value);
          }}
          placeholder='e.g. EGLL'
          type="text"
        />
      </div>
      <button className="flight-form-log-button" disabled={props.isSaving} type="submit">
        {props.isSaving ? "Saving..." : "Log flight"}
      </button>
      {form.validationMessage !== null ? (
        <p className="form-error mt-4">{form.validationMessage}</p>
      ) : null}
    </form>
  );
}

export default FlightLogForm;
