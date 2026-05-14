import {
    validateIcaoCode,
} from 'airport-data-js';

export async function validateIcao(icaoCode: string) {
    // Search airports by name
    return !!await validateIcaoCode(icaoCode);
}