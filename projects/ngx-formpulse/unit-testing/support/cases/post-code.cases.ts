import {FpCountry} from '../../../lib/enums/fp-country';

export interface PostCodeCase {
  readonly description: string;
  readonly value: string | number | null;
  readonly country: FpCountry | null;
  readonly strict: boolean;
  readonly isValid: boolean;
}

const UNSUPPORTED_NUMBER_VALUE = 1001;

export const POST_CODE_CASES: readonly PostCodeCase[] = [
  {description: 'Ukrainian postal code', value: '01001', country: FpCountry.UA, strict: false, isValid: true},
  {description: 'Ukrainian postal code with four digits', value: '0100', country: FpCountry.UA, strict: false, isValid: false},
  {description: 'Ukrainian postal code with surrounding spaces', value: ' 01001 ', country: FpCountry.UA, strict: false, isValid: true},
  {description: 'Ukrainian postal code with surrounding spaces in strict mode', value: ' 01001 ', country: FpCountry.UA, strict: true, isValid: false},
  {description: 'Polish postal code', value: '00-950', country: FpCountry.PL, strict: false, isValid: true},
  {description: 'Polish postal code without the hyphen', value: '00950', country: FpCountry.PL, strict: false, isValid: false},
  {description: 'British postcode', value: 'SW1A 1AA', country: FpCountry.GB, strict: false, isValid: true},
  {description: 'British postcode without the space', value: 'SW1A1AA', country: FpCountry.GB, strict: false, isValid: true},
  {description: 'British postcode in lower case', value: 'sw1a 1aa', country: FpCountry.GB, strict: false, isValid: true},
  {description: 'British postcode in lower case in strict mode', value: 'sw1a 1aa', country: FpCountry.GB, strict: true, isValid: false},
  {description: 'British postcode with an unknown area', value: 'X1 1XX', country: FpCountry.GB, strict: false, isValid: false},
  {description: 'US ZIP code', value: '95014', country: FpCountry.US, strict: false, isValid: true},
  {description: 'US ZIP+4 code', value: '22162-1010', country: FpCountry.US, strict: false, isValid: true},
  {description: 'US ZIP code with four digits', value: '9501', country: FpCountry.US, strict: false, isValid: false},
  {description: 'Dutch postal code with a space', value: '1234 AB', country: FpCountry.NL, strict: false, isValid: true},
  {description: 'Dutch postal code without a space', value: '1234AB', country: FpCountry.NL, strict: false, isValid: true},
  {description: 'Dutch postal code with one letter', value: '1234 A', country: FpCountry.NL, strict: false, isValid: false},
  {description: 'Canadian postal code', value: 'K1A 0B1', country: FpCountry.CA, strict: false, isValid: true},
  {description: 'Canadian postal code with a forbidden first letter', value: 'D1A 0B1', country: FpCountry.CA, strict: false, isValid: false},
  {description: 'any value for a country without postal codes', value: 'ANYTHING', country: FpCountry.AE, strict: false, isValid: true},
  {description: 'Ukrainian postal code in any-country mode', value: '01001', country: null, strict: false, isValid: true},
  {description: 'symbols in any-country mode', value: '%%%', country: null, strict: false, isValid: false},
  {description: 'an empty value', value: '', country: FpCountry.UA, strict: false, isValid: true},
  {description: 'null', value: null, country: FpCountry.UA, strict: false, isValid: true},
  {description: 'a number instead of text', value: UNSUPPORTED_NUMBER_VALUE, country: FpCountry.UA, strict: false, isValid: false},
  {description: 'spaces only', value: '   ', country: FpCountry.UA, strict: false, isValid: false},
  {description: 'spaces only in strict mode', value: '   ', country: FpCountry.UA, strict: true, isValid: false},
  {description: 'spaces only in any-country mode', value: '   ', country: null, strict: false, isValid: false},
  {description: 'spaces only for a country without postal codes', value: '   ', country: FpCountry.AE, strict: false, isValid: false},
  {description: 'a non-breaking space in any-country mode', value: ' ', country: null, strict: false, isValid: false},
  {description: 'British postcode with a non-ASCII long s', value: 'ſw1a 1aa', country: FpCountry.GB, strict: false, isValid: false},
  {description: 'British postcode with two inner spaces', value: 'SW1A  1AA', country: FpCountry.GB, strict: false, isValid: false},
  {description: 'British postcode in lower case in any-country mode', value: 'sw1a 1aa', country: null, strict: false, isValid: true},
  {description: 'any value for a country missing from the data', value: 'ANYTHING', country: FpCountry.CU, strict: false, isValid: true}
];
