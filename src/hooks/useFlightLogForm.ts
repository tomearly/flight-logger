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
  const [isHoursInvalid, setIsHoursInvalid] = useState<boolean>(false);
  const [isTailNumberInvalid, setIsTailNumberInvalid] = useState<boolean>(false);
  const [isFromICAOInvalid, setIsFromICAOInvalid] = useState<boolean>(false);
  const [isToICAOInvalid, setIsToICAOInvalid] = useState<boolean>(false);

  function resetForm(): void {
    setHours("");
    setTailNumber("");
    setFromICAO("");
    setToICAO("");
  }

  function resetInvalidInputs(): void {
    setIsHoursInvalid(false);
    setIsTailNumberInvalid(false);
    setIsFromICAOInvalid(false);
    setIsToICAOInvalid(false);
  }

  function handleHoursChange(hoursValue: string): void {
    setHours(hoursValue);
    setIsHoursInvalid(false);
  }

  function handleTailNumberChange(tailNumberValue: string): void {
    setTailNumber(tailNumberValue);
    setIsTailNumberInvalid(false);
  }

  function handleFromDestinationICAO(fromICAOValue: string): void {
    setFromICAO(fromICAOValue);
    setIsFromICAOInvalid(false);
  }

  function handleToDestinationICAO(toICAOValue: string): void {
    setToICAO(toICAOValue);
    setIsToICAOInvalid(false);
  }

  async function logFlight(): Promise<void> {
    try {
      resetInvalidInputs();

      const validationMessages: string[] = [];
      let parsedHours: number | null = null;
      let validatedTailNumber: string | null = null;

      try {
        parsedHours = parseHours(hours);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setIsHoursInvalid(true);
          validationMessages.push(error.message);
        } else {
          throw error;
        }
      }

      try {
        validatedTailNumber = validateTailNumber(tailNumber);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setIsTailNumberInvalid(true);
          validationMessages.push(error.message);
        } else {
          throw error;
        }
      }

      const normalizedFromICAO: string = normalizeIcaoCode(fromICAO);
      const normalizedToICAO: string = normalizeIcaoCode(toICAO);
      const [validatedFromICAO, validatedToICAO]: [boolean, boolean] = await Promise.all([
        validateIcao(normalizedFromICAO),
        validateIcao(normalizedToICAO)
      ]);

      if (!validatedFromICAO) {
        setIsFromICAOInvalid(true);
        validationMessages.push("Enter valid from airport ICAO code.");
      }

      if (!validatedToICAO) {
        setIsToICAOInvalid(true);
        validationMessages.push("Enter valid to airport ICAO code.");
      }

      if (validationMessages.length > 0) {
        throw new Error(validationMessages[0]);
      }

      if (parsedHours === null || validatedTailNumber === null) {
        throw new Error("Expected validated flight form values.");
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
    isHoursInvalid,
    isTailNumberInvalid,
    isFromICAOInvalid,
    isToICAOInvalid,
    handleHoursChange,
    handleTailNumberChange,
    handleFromDestinationICAO,
    handleToDestinationICAO,
    handleSubmit
  };
}
