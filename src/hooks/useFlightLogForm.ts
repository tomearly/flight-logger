import { type SubmitEvent, useState } from "react";
import { parseHours, validateTailNumber } from "../libs/validators";

import { type UseFlightLogFormResult } from "../types/UseFlightLogFormResult";
import { type UseFlightLogFormParams } from "../types/UseFlightLogFormParams";

import { validateIcao } from "./useAirportData";

export function useFlightLogForm(params: UseFlightLogFormParams): UseFlightLogFormResult {
  const [hours, setHours] = useState<string>("");
  const [tailNumber, setTailNumber] = useState<string>("");
  const [fromICAO, setFromICAO] = useState<string>("");
  const [toICAO, setToICAO] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  function resetForm() {
      setHours("");
      setTailNumber("");
      setFromICAO("");
      setToICAO("");
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      const parsedHours: number = parseHours(hours);
      const validatedTailNumber: string = validateTailNumber(tailNumber);
      const validatedFromICAO: boolean = await validateIcao(fromICAO);
      const validatedToICAO: boolean = await validateIcao(toICAO);

      if(!validatedFromICAO && !validatedToICAO) {
        throw new Error("Invalid to/from airport");
      }

      setValidationMessage(null);
      params.onLogFlight(parsedHours, validatedTailNumber, fromICAO, toICAO);
      resetForm();
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
    fromICAO,
    toICAO,
    handleHoursChange: setHours,
    handleTailNumberChange: setTailNumber,
    handleFromDestinationICAO: setFromICAO,
    handleToDestinationICAO: setToICAO,
    handleSubmit
  };
}
