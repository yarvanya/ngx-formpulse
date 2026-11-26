const ASCII_LOWER_CASE_LETTERS = /[a-z]+/g;

export function normalizeWhitespace(text_value: string, is_strict: boolean): string {
  return is_strict ? text_value : text_value.trim();
}

export function normalizeLetterCase(text_value: string, is_strict: boolean): string {
  return is_strict ? text_value : text_value.replace(ASCII_LOWER_CASE_LETTERS, (letters) => letters.toUpperCase());
}
