import {FpLocale, type FpLocalePack} from 'ngx-formpulse';

/**
 * FormPulse locale pack: Ukrainian messages for every validator.
 *
 * @example
 * ```ts
 * import {FpLocale, provideFormPulse} from 'ngx-formpulse';
 * import {fpLocaleUk} from 'ngx-formpulse/locales/uk';
 *
 * provideFormPulse({locale: FpLocale.Uk, locales: [fpLocaleUk]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export const fpLocaleUk = {
  locale: FpLocale.Uk,
  messages: {}
} as const satisfies FpLocalePack;
