import {FpLocale, type FpLocalePack} from 'ngx-formpulse';

/**
 * FormPulse locale pack: Spanish messages for every validator.
 *
 * @example
 * ```ts
 * import {FpLocale, provideFormPulse} from 'ngx-formpulse';
 * import {fpLocaleEs} from 'ngx-formpulse/locales/es';
 *
 * provideFormPulse({locale: FpLocale.Es, locales: [fpLocaleEs]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export const fpLocaleEs = {
  locale: FpLocale.Es,
  messages: {}
} as const satisfies FpLocalePack;
