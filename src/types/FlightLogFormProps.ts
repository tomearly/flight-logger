export type FlightLogFormProps = {
  isSaving: boolean;
  onLogFlight: (hours: number, tailNumber: string, fromICAO: string, toICAO: string) => void;
};
