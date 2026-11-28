import type {FpError} from '../../core/fp-error';
import type {FpBaseOptions} from '../../core/fp-options';
import {resolveMessage} from '../../core/message-resolver';
import {isNumber, isObject, isString} from '../../utilities/core.utility';

/**
 * Error of {@link fpRequired}, reported under `errors.fpRequired`.
 *
 * - `message`: the resolved, localized message.
 *
 * @example
 * ```ts
 * const requiredError: FpRequiredError | undefined = control.errors?.['fpRequired'];
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fprequired
 */
export type FpRequiredError = FpError;

/**
 * Options of {@link fpRequired}.
 *
 * - `locale`: message locale for this validator only.
 * - `message`: custom message (string or function).
 *
 * @example
 * ```ts
 * fpRequired({message: 'Enter your name.'});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fprequired
 */
export type FpRequiredOptions = FpBaseOptions<FpRequiredError>;

export const REQUIRED_VALIDATOR_KEY = 'fpRequired';

const FILE_LIST_TAG = '[object FileList]';

function isFileList(control_value: object): control_value is ArrayLike<unknown> {
  return Object.prototype.toString.call(control_value) === FILE_LIST_TAG;
}

function isMissingObject(control_value: object): boolean {
  if (Array.isArray(control_value) || isFileList(control_value)) {
    return control_value.length === 0;
  }
  if (control_value instanceof Set || control_value instanceof Map) {
    return control_value.size === 0;
  }
  if (control_value instanceof Date) {
    return Number.isNaN(control_value.getTime());
  }
  return false;
}

export function isMissingValue(control_value: unknown): boolean {
  if (control_value === null || control_value === undefined) {
    return true;
  }
  if (isString(control_value)) {
    return control_value.trim() === '';
  }
  if (isNumber(control_value)) {
    return Number.isNaN(control_value);
  }
  return isObject(control_value) && isMissingObject(control_value);
}

export function checkRequired(control_value: unknown, validator_options: FpRequiredOptions): FpRequiredError | null {
  if (!isMissingValue(control_value)) {
    return null;
  }
  const message = resolveMessage({
    validatorKey: REQUIRED_VALIDATOR_KEY,
    englishMessage: 'This field is required.',
    errorParameters: {},
    inlineLocale: validator_options.locale,
    inlineMessage: validator_options.message
  });
  return {message};
}
