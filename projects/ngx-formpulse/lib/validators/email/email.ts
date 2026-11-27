import {isBlankText, isEmptyValue} from '../../core/empty-value';
import type {FpError} from '../../core/fp-error';
import type {FpBaseOptions} from '../../core/fp-options';
import {resolveMessage} from '../../core/message-resolver';
import {normalizeWhitespace} from '../../core/normalize';
import {isString} from '../../utilities/core.utility';

/**
 * Error of {@link fpEmail}, reported under `errors.fpEmail`.
 *
 * - `message`: the resolved, localized message.
 *
 * @example
 * ```ts
 * const emailError: FpEmailError | undefined = control.errors?.['fpEmail'];
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fpemail
 */
export type FpEmailError = FpError;

/**
 * Options of {@link fpEmail}.
 *
 * - `locale`: message locale for this validator only.
 * - `message`: custom message (string or function).
 * - `strict`: check the value exactly as entered; by default surrounding whitespace is ignored.
 *
 * @example
 * ```ts
 * fpEmail({strict: true, locale: FpLocale.En});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fpemail
 */
export interface FpEmailOptions extends FpBaseOptions<FpEmailError> {
  readonly strict?: boolean;
}

export const EMAIL_VALIDATOR_KEY = 'fpEmail';

const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_PART_LENGTH = 64;
const MAX_LABEL_LENGTH = 63;
const MIN_TOP_LEVEL_DOMAIN_LENGTH = 2;
const MIN_LABEL_COUNT = 2;
const AT_SIGN = '@';
const LABEL_SEPARATOR = '.';
const HYPHEN = '-';
const LOCAL_PART_PATTERN = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const LABEL_PATTERN = /^[a-zA-Z0-9-]+$/;
const TOP_LEVEL_DOMAIN_PATTERN = /^(?:[a-zA-Z]+|[xX][nN]--[a-zA-Z0-9-]+)$/;

function isValidLocalPart(local_part: string): boolean {
  return local_part.length <= MAX_LOCAL_PART_LENGTH && LOCAL_PART_PATTERN.test(local_part);
}

function isValidLabel(label: string): boolean {
  return label.length <= MAX_LABEL_LENGTH
    && LABEL_PATTERN.test(label)
    && !label.startsWith(HYPHEN)
    && !label.endsWith(HYPHEN);
}

function isValidTopLevelDomain(top_level_domain: string): boolean {
  return top_level_domain.length >= MIN_TOP_LEVEL_DOMAIN_LENGTH && TOP_LEVEL_DOMAIN_PATTERN.test(top_level_domain);
}

function isValidDomain(domain: string): boolean {
  const labels = domain.split(LABEL_SEPARATOR);
  return labels.length >= MIN_LABEL_COUNT
    && labels.every((label) => isValidLabel(label))
    && isValidTopLevelDomain(domain.slice(domain.lastIndexOf(LABEL_SEPARATOR) + 1));
}

function isValidEmail(email_address: string): boolean {
  const atSignIndex = email_address.indexOf(AT_SIGN);
  if (email_address.length > MAX_EMAIL_LENGTH || atSignIndex === -1 || atSignIndex !== email_address.lastIndexOf(AT_SIGN)) {
    return false;
  }
  return isValidLocalPart(email_address.slice(0, atSignIndex)) && isValidDomain(email_address.slice(atSignIndex + 1));
}

export function checkEmail(control_value: unknown, validator_options: FpEmailOptions): FpEmailError | null {
  if (isEmptyValue(control_value)) {
    return null;
  }
  if (!isBlankText(control_value) && isString(control_value) && isValidEmail(normalizeWhitespace(control_value, validator_options.strict ?? false))) {
    return null;
  }
  const message = resolveMessage({
    validatorKey: EMAIL_VALIDATOR_KEY,
    englishMessage: 'Enter a valid email address, e.g. name@example.com.',
    errorParameters: {},
    inlineLocale: validator_options.locale,
    inlineMessage: validator_options.message
  });
  return {message};
}
