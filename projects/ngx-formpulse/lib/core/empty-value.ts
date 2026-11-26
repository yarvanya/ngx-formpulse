import {isString} from '../utilities/core.utility';

export function isEmptyValue(control_value: unknown): boolean {
  return control_value === null || control_value === undefined || control_value === '';
}

export function isBlankText(control_value: unknown): boolean {
  return isString(control_value) && control_value !== '' && control_value.trim() === '';
}
