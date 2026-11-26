import type {FpErrorMap, FpValidatorKey} from './fp-error-map';
import type {FpLocale} from './fp-locale';
import type {FpLocalePack} from './fp-locale-pack';
import type {FpMessage} from './fp-message';

/**
 * Application-wide replacements of built-in messages, keyed by validator.
 *
 * @example
 * ```ts
 * const messages: FpMessageOverrides = {fpPostCode: 'Check the postal code.'};
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#messages
 */
export type FpMessageOverrides = {readonly [TKey in FpValidatorKey]?: FpMessage<FpErrorMap[TKey]>};

/**
 * Application-wide FormPulse configuration. Every field is optional; with no configuration all
 * messages are English.
 *
 * - `locale`: default locale of messages; English when omitted.
 * - `locales`: locale packs to make available; registering a pack never changes the default.
 * - `messages`: application-wide message overrides.
 *
 * @example
 * ```ts
 * provideFormPulse({locale: FpLocale.Uk, locales: [fpLocaleUk, fpLocaleDe]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#configuration
 */
export interface FpFormPulseConfig {
  readonly locale?: FpLocale;
  readonly locales?: readonly FpLocalePack[];
  readonly messages?: FpMessageOverrides;
}
