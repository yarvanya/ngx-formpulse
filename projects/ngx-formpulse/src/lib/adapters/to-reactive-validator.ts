import type {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import type {FpError} from '../core/fp-error';

export function toReactiveValidator(validator_key: string, value_check: (control_value: unknown) => FpError | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validationError = value_check(control.value);
    return validationError === null ? null : {[validator_key]: validationError};
  };
}
