import { SubmitEvent } from "react";

export type UseFlightLogFormResult = {
  hours: string;
  tailNumber: string;
  validationMessage: string | null;
  handleHoursChange: (hours: string) => void;
  handleTailNumberChange: (tailNumber: string) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};
