import type {ValidatorFn} from '@angular/forms';
import {toReactiveValidator} from '../../adapters/to-reactive-validator';
import {checkEmail, EMAIL_VALIDATOR_KEY, type FpEmailOptions} from './email';

/**
 * Validates an email address: the HTML5 `type=email` grammar tightened with RFC 5321, RFC 5322 and
 * RFC 1035 rules.
 *
 * Empty values (`''`, `null`, `undefined`) are valid; a blank string is invalid. The local part has
 * 1–64 RFC 5322 `atext` characters with dots only between them; the domain has at least two labels of
 * letters, digits and inner hyphens (1–63 each, 253 in total) and ends with a top-level domain of
 * 2+ letters or a punycode `xn--` label; the address has at most 254 characters. ASCII only: quoted
 * local parts, IP-address domains and display names are invalid. Checks the format, not that the
 * mailbox exists.
 *
 * @param validator_options - Locale, custom message and strict matching.
 * @returns A Reactive Forms validator reporting {@link FpEmailError} under `errors.fpEmail`.
 *
 * @example
 * ```ts
 * new FormControl('', [fpEmail()]);
 * new FormControl('', [fpEmail({message: 'Check the email address.'})]);
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fpemail
 */
export function fpEmail(validator_options: FpEmailOptions = {}): ValidatorFn {
  return toReactiveValidator(EMAIL_VALIDATOR_KEY, (control_value) => checkEmail(control_value, validator_options));
}
