import {FpLocale, type FpLocalePack} from 'ngx-formpulse';

/**
 * FormPulse locale pack: German messages for every validator.
 *
 * @example
 * ```ts
 * import {FpLocale, provideFormPulse} from 'ngx-formpulse';
 * import {fpLocaleDe} from 'ngx-formpulse/locales/de';
 *
 * provideFormPulse({locale: FpLocale.De, locales: [fpLocaleDe]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export const fpLocaleDe = {
  locale: FpLocale.De,
  messages: {}
} as const satisfies FpLocalePack;
