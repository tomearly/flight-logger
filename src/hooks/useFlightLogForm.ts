import { type SubmitEvent, useState } from "react";
import { parseHours, validateTailNumber } from "../libs/validators";

import { type UseFlightLogFormResult } from "../types/UseFlightLogFormResult";
import { type UseFlightLogFormParams } from "../types/UseFlightLogFormParams";

import { validateIcao } from "./useAirportData";

function normalizeIcaoCode(icaoCode: string): string {
  return icaoCode.trim().toUpperCase();
}

export function useFlightLogForm(params: UseFlightLogFormParams): UseFlightLogFormResult {
  const [hours, setHours] = useState<string>("");
  const [tailNumber, setTailNumber] = useState<string>("");
  const [fromICAO, setFromICAO] = useState<string>("");
  const [toICAO, setToICAO] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  function resetForm(): void {
    setHours("");
    setTailNumber("");
    setFromICAO("");
    setToICAO("");
  }

  async function logFlight(): Promise<void> {
    try {
      const parsedHours: number = parseHours(hours);
      const validatedTailNumber: string = validateTailNumber(tailNumber);
      const normalizedFromICAO: string = normalizeIcaoCode(fromICAO);
      const normalizedToICAO: string = normalizeIcaoCode(toICAO);
      const validatedFromICAO: boolean = await validateIcao(normalizedFromICAO);
      const validatedToICAO: boolean = await validateIcao(normalizedToICAO);

      if (!validatedFromICAO || !validatedToICAO) {
        throw new Error("Enter valid from and to ICAO airports.");
      }

      setValidationMessage(null);
      params.onLogFlight(parsedHours, validatedTailNumber, normalizedFromICAO, normalizedToICAO);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setValidationMessage(error.message);
        return;
      }

      throw error;
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    void logFlight();
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
