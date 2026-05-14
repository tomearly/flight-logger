import { type SubmitEvent, useState } from "react";
import { parseHours, validateTailNumber } from "../libs/validators";

import { type UseFlightLogFormResult } from "../types/UseFlightLogFormResult";
import { type UseFlightLogFormParams } from "../types/UseFlightLogFormParams";

export function useFlightLogForm(params: UseFlightLogFormParams): UseFlightLogFormResult {
  const [hours, setHours] = useState<string>("");
  const [tailNumber, setTailNumber] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    try {
      const parsedHours: number = parseHours(hours);
      const validatedTailNumber: string = validateTailNumber(tailNumber);

      setValidationMessage(null);
      params.onLogFlight(parsedHours, validatedTailNumber);
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

  return {
    hours,
    tailNumber,
    validationMessage,
    handleHoursChange: setHours,
    handleTailNumberChange: setTailNumber,
    handleSubmit
  };
}
