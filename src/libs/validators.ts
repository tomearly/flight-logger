import { ukTailNumberRegex } from "../constants/aircraft";

export function parseHours(value: string): number {
  const hours: number = Number(value);

  if (!Number.isFinite(hours) || hours <= 0) {
    throw new Error("Enter flight hours greater than 0.");
  }

  return hours;
}

const isValidUKTailNumber = (tailNumber: string) => ukTailNumberRegex.test(tailNumber);

export function validateTailNumber(tailNumber: string): string {
  const trimmedTailNumber: string = tailNumber.trim();

  if (!isValidUKTailNumber(trimmedTailNumber)) {
    throw new Error("Not a valid UK tail number");
  }

  return trimmedTailNumber.toUpperCase();
}
