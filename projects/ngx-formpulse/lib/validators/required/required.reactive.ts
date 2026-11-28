import type {ValidatorFn} from '@angular/forms';
import {toReactiveValidator} from '../../adapters/to-reactive-validator';
import {checkRequired, type FpRequiredOptions, REQUIRED_VALIDATOR_KEY} from './required';

/**
 * Requires a value of any type.
 *
 * Missing: `null`, `undefined`, an empty or blank string (spaces, non-breaking spaces, tabs), `NaN`, an
 * invalid `Date`, and an empty array, `Set`, `Map` or `FileList`. Filled: every other value, including
 * `0`, `false` and `{}`. An untouched checkbox (`null`) is missing; `false` is a real answer. The control
 * value is never modified.
 *
 * Angular detects only its own `Validators.required` for the required marker, so add the `required`
 * attribute to the input to show the asterisk.
 *
 * @param validator_options - Locale and custom message.
 * @returns A Reactive Forms validator reporting {@link FpRequiredError} under `errors.fpRequired`.
 *
 * @example
 * ```ts
 * new FormControl('', [fpRequired()]);
 * new FormControl<number | null>(null, [fpRequired({message: 'Enter a quantity.'})]);
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fprequired
 */
export function fpRequired(validator_options: FpRequiredOptions = {}): ValidatorFn {
  return toReactiveValidator(REQUIRED_VALIDATOR_KEY, (control_value) => checkRequired(control_value, validator_options));
}
