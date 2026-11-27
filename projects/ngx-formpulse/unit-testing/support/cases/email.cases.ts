export interface EmailCase {
  readonly description: string;
  readonly value: string | number | null;
  readonly strict: boolean;
  readonly isValid: boolean;
}

const UNSUPPORTED_NUMBER_VALUE = 1;
const MAX_LOCAL_PART_LENGTH = 64;
const MAX_LABEL_LENGTH = 63;
const LAST_LABEL_LENGTH_AT_EMAIL_LIMIT = 57;

const LONGEST_LOCAL_PART = 'a'.repeat(MAX_LOCAL_PART_LENGTH);
const LONGEST_LABEL = 'b'.repeat(MAX_LABEL_LENGTH);
const DOMAIN_AT_EMAIL_LIMIT = `${LONGEST_LABEL}.${LONGEST_LABEL}.${'c'.repeat(LAST_LABEL_LENGTH_AT_EMAIL_LIMIT)}.com`;
const DOMAIN_OVER_EMAIL_LIMIT = `${LONGEST_LABEL}.${LONGEST_LABEL}.${'c'.repeat(LAST_LABEL_LENGTH_AT_EMAIL_LIMIT + 1)}.com`;

export const EMAIL_CASES: readonly EmailCase[] = [
  {description: 'plain address', value: 'name@example.com', strict: false, isValid: true},
  {description: 'address with a subdomain', value: 'ivan.petrenko@mail.example.com.ua', strict: false, isValid: true},
  {description: 'address with a +tag', value: 'name+news@example.com', strict: false, isValid: true},
  {description: 'address with every special character allowed before @', value: 'a!#$%&\'*+/=?^_`{|}~-z@example.com', strict: false, isValid: true},
  {description: 'address in upper case', value: 'NAME@EXAMPLE.COM', strict: false, isValid: true},
  {description: 'address with digits and a hyphen in the domain', value: 'name@mail-1.example2.com', strict: false, isValid: true},
  {description: 'address with a punycode top-level domain', value: 'name@example.xn--j1amh', strict: false, isValid: true},
  {description: 'address with a punycode domain', value: 'name@xn--80ak6aa92e.com', strict: false, isValid: true},
  {description: 'address with a two-letter top-level domain', value: 'name@example.ua', strict: false, isValid: true},
  {description: 'part before @ of 64 characters', value: `${LONGEST_LOCAL_PART}@example.com`, strict: false, isValid: true},
  {description: 'part before @ of 65 characters', value: `${LONGEST_LOCAL_PART}a@example.com`, strict: false, isValid: false},
  {description: 'domain label of 63 characters', value: `name@${LONGEST_LABEL}.com`, strict: false, isValid: true},
  {description: 'domain label of 64 characters', value: `name@${LONGEST_LABEL}b.com`, strict: false, isValid: false},
  {description: 'address of 254 characters', value: `${LONGEST_LOCAL_PART}@${DOMAIN_AT_EMAIL_LIMIT}`, strict: false, isValid: true},
  {description: 'address of 255 characters', value: `${LONGEST_LOCAL_PART}@${DOMAIN_OVER_EMAIL_LIMIT}`, strict: false, isValid: false},
  {description: 'dot at the start of the part before @', value: '.name@example.com', strict: false, isValid: false},
  {description: 'dot at the end of the part before @', value: 'name.@example.com', strict: false, isValid: false},
  {description: 'two dots in a row before @', value: 'na..me@example.com', strict: false, isValid: false},
  {description: 'address without @', value: 'name.example.com', strict: false, isValid: false},
  {description: 'address with two @', value: 'name@home@example.com', strict: false, isValid: false},
  {description: 'nothing before @', value: '@example.com', strict: false, isValid: false},
  {description: 'nothing after @', value: 'name@', strict: false, isValid: false},
  {description: 'domain without a top-level domain', value: 'name@company', strict: false, isValid: false},
  {description: 'numeric top-level domain', value: 'name@example.123', strict: false, isValid: false},
  {description: 'one-letter top-level domain', value: 'name@example.c', strict: false, isValid: false},
  {description: 'hyphen at the start of a domain label', value: 'name@-example.com', strict: false, isValid: false},
  {description: 'hyphen at the end of a domain label', value: 'name@example-.com', strict: false, isValid: false},
  {description: 'two dots in a row in the domain', value: 'name@example..com', strict: false, isValid: false},
  {description: 'dot at the end of the domain', value: 'name@example.com.', strict: false, isValid: false},
  {description: 'underscore in the domain', value: 'name@my_company.com', strict: false, isValid: false},
  {description: 'IP address instead of a domain', value: 'name@[192.168.0.1]', strict: false, isValid: false},
  {description: 'IPv4 address as a domain', value: 'name@192.168.0.1', strict: false, isValid: false},
  {description: 'display name with the address', value: 'Ivan <ivan@example.com>', strict: false, isValid: false},
  {description: 'quoted part before @', value: '"ivan petrenko"@example.com', strict: false, isValid: false},
  {description: 'space inside the address', value: 'ivan petrenko@example.com', strict: false, isValid: false},
  {description: 'Cyrillic letters', value: 'іван@приклад.укр', strict: false, isValid: false},
  {description: 'Cyrillic top-level domain', value: 'name@example.укр', strict: false, isValid: false},
  {description: 'surrounding spaces', value: ' name@example.com ', strict: false, isValid: true},
  {description: 'surrounding spaces in strict mode', value: ' name@example.com ', strict: true, isValid: false},
  {description: 'spaces only', value: '   ', strict: false, isValid: false},
  {description: 'an empty value', value: '', strict: false, isValid: true},
  {description: 'null', value: null, strict: false, isValid: true},
  {description: 'a number instead of text', value: UNSUPPORTED_NUMBER_VALUE, strict: false, isValid: false}
];
