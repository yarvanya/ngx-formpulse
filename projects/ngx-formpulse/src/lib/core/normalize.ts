export function normalizeWhitespace(text_value: string, is_strict: boolean): string {
  return is_strict ? text_value : text_value.trim();
}

export function normalizeLetterCase(text_value: string, is_strict: boolean): string {
  return is_strict ? text_value : text_value.toUpperCase();
}
