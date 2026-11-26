import type {FpValidatorKey} from './fp-error-map';
import type {FpLocale} from './fp-locale';

/**
 * Messages of one locale: one template per FormPulse validator.
 *
 * @example
 * ```ts
 * const messages: FpLocaleMessages = {fpPostCode: 'Expected format: {expectedFormat}.'};
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export type FpLocaleMessages = Readonly<Record<FpValidatorKey, string>>;

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
