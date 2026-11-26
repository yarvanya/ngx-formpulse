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
  messages: {
    fpPostCode: ({examples: [example]}) => (example === undefined
      ? 'Introduce un código postal válido.'
      : `Introduce un código postal válido, por ejemplo ${example}.`)
  }
} as const satisfies FpLocalePack;
