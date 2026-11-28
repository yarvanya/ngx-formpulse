import type {FpEmailError} from '../validators/email/email';
import type {FpPostCodeError} from '../validators/post-code/post-code';
import type {FpRequiredError} from '../validators/required/required';

/**
 * Maps every FormPulse validator key (e.g. `fpPostCode`) to the type of its error.
 *
 * Locale packs and application-wide message overrides are typed from this map, so a new validator
 * cannot ship without a message in every locale.
 *
 * @example
 * ```ts
 * type PostCodeError = FpErrorMap['fpPostCode'];
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#errors
 */
export interface FpErrorMap {
  readonly fpEmail: FpEmailError;
  readonly fpPostCode: FpPostCodeError;
  readonly fpRequired: FpRequiredError;
}

/**
 * Key of a FormPulse validator; equals the error key in `control.errors`.
 *
 * @example
 * ```ts
 * const validatorKey: FpValidatorKey = 'fpPostCode';
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#errors
 */
export type FpValidatorKey = keyof FpErrorMap;
