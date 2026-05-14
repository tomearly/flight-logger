import { type SubmitEvent } from "react";

export type UseFlightLogFormResult = {
  hours: string;
  tailNumber: string;
  validationMessage: string | null;
  fromICAO: string;
  toICAO: string;
  handleHoursChange: (hours: string) => void;
  handleTailNumberChange: (tailNumber: string) => void;
  handleFromDestinationICAO: (fromICAO: string) => void;
  handleToDestinationICAO: (toICAO: string) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};
