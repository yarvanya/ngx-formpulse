import type {FpErrorMap, FpValidatorKey} from './fp-error-map';
import type {FpLocale} from './fp-locale';
import type {FpMessage} from './fp-message';

/**
 * Messages of one locale: one message per FormPulse validator, either a `{parameterName}` template
 * or a function of the error parameters.
 *
 * @example
 * ```ts
 * const messages: FpLocaleMessages = {
 *   fpPostCode: ({examples: [example]}) => example === undefined ? 'Invalid postal code.' : `Invalid postal code, e.g. ${example}.`
 * };
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export type FpLocaleMessages = {readonly [TKey in FpValidatorKey]: FpMessage<FpErrorMap[TKey]>};

/**
 * Locale pack: the messages of every FormPulse validator in one language. Import packs from
 * `ngx-formpulse/locales/<code>` and register them with {@link provideFormPulse}.
 *
 * @example
 * ```ts
 * import {fpLocaleUk} from 'ngx-formpulse/locales/uk';
 *
 * provideFormPulse({locales: [fpLocaleUk]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export interface FpLocalePack {
  readonly locale: FpLocale;
  readonly messages: FpLocaleMessages;
}
