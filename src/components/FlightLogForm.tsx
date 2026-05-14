import { SubmitEvent, useState } from "react";
import { type FlightLogFormProps } from "../types/FlightLogFormProps";
import { parseHours, validateTailNumber } from "../libs/validators";

function FlightLogForm(props: FlightLogFormProps): React.JSX.Element {
  const [hours, setHours] = useState<string>("");
  const [tailNumber, setTailNumber] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    try {
      const parsedHours: number = parseHours(hours);
      const validatedTailNumber: string = validateTailNumber(tailNumber);
      
      setValidationMessage(null);
      await props.onLogFlight(parsedHours, validatedTailNumber);
      setHours("");
      setTailNumber("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setValidationMessage(error.message);
        return;
      }

      throw error;
    }
  }

  return (
    <form className="flight-form" onSubmit={handleSubmit}>
      <label htmlFor="hours">Hours</label>
      <div className="flight-form-row">
        <input
          id="hours"
          min="0.1"
          onChange={(event) => setHours(event.target.value)}
          step="0.1"
          type="number"
          value={hours}
        />
      </div>
      <label htmlFor="tailNumber">Tail Number</label>
      <div className="flight-form-row">
        <input
          id="tailNumber"
          onChange={(event) => setTailNumber(event.target.value)}
          type="text"
          value={tailNumber}
        />
      </div>
      <button disabled={props.isSaving} type="submit">
          {props.isSaving ? "Saving..." : "Log hours"}
      </button>
      {validationMessage !== null ? <p className="form-error mt-4">{validationMessage}</p> : null}
    </form>
  );
}

export default FlightLogForm;
