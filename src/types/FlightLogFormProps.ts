export type FlightLogFormProps = {
  isSaving: boolean;
  onLogFlight: (hours: number, tailNumber: string) => Promise<void>;
};
