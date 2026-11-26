export function isEmptyValue(control_value: unknown): boolean {
  return control_value === null || control_value === undefined || control_value === '';
}
