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
          aria-invalid={form.isHoursInvalid}
          className={form.isHoursInvalid ? "flight-form-input-invalid" : undefined}
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
          aria-invalid={form.isTailNumberInvalid}
          className={form.isTailNumberInvalid ? "flight-form-input-invalid" : undefined}
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
          aria-invalid={form.isFromICAOInvalid}
          className={form.isFromICAOInvalid ? "flight-form-input-invalid" : undefined}
          id="fromICAO"
          onChange={(event) => {
            form.handleFromDestinationICAO(event.target.value);
          }}
          placeholder="e.g. EHAM"
          type="text"
          value={form.fromICAO}
        />
      </div>
      <label htmlFor="toICAO">To ICAO</label>
      <div className="flight-form-row">
        <input
          aria-invalid={form.isToICAOInvalid}
          className={form.isToICAOInvalid ? "flight-form-input-invalid" : undefined}
          id="toICAO"
          onChange={(event) => {
            form.handleToDestinationICAO(event.target.value);
          }}
          placeholder="e.g. EGLL"
          type="text"
          value={form.toICAO}
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
