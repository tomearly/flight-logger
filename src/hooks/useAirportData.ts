import { validateIcaoCode } from "airport-data-js";

export async function validateIcao(icaoCode: string): Promise<boolean> {
  return validateIcaoCode(icaoCode);
}
