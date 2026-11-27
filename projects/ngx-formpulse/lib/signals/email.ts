import type {SchemaPath} from '@angular/forms/signals';
import {checkEmail, EMAIL_VALIDATOR_KEY, type FpEmailOptions} from '../validators/email/email';
import {isFunction} from '../utilities/core.utility';
import {applySignalValidator} from './apply-signal-validator';

/**
 * Validates a Signal Forms field as an email address: the HTML5 `type=email` grammar tightened with
 * RFC 5321, RFC 5322 and RFC 1035 rules.
 *
 * Empty values (`''`, `null`, `undefined`) are valid; a blank string is invalid. A top-level domain is
 * required, ASCII only. Checks the format, not that the mailbox exists. The error has
 * `kind: 'fpEmail'` and the same payload as in Reactive Forms. Options may be a function, read on
 * every validation, so they can follow signals.
 *
 * @param schema_path - Field to validate.
 * @param validator_options - Locale, custom message and strict matching, or a function returning them.
 *
 * @example
 * ```ts
 * form(model, (path) => {
 *   fpEmail(path.email);
 *   fpEmail(path.backupEmail, () => ({strict: isStrict()}));
 * });
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fpemail
 */
export function fpEmail<TValue extends string | null | undefined>(
  schema_path: SchemaPath<TValue>,
  validator_options: FpEmailOptions | (() => FpEmailOptions) = {}
): void {
  applySignalValidator(schema_path, EMAIL_VALIDATOR_KEY, (control_value) => checkEmail(control_value, isFunction(validator_options) ? validator_options() : validator_options));
}
