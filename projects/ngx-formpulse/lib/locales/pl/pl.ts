import {FpLocale, type FpLocalePack} from 'ngx-formpulse';

/**
 * FormPulse locale pack: Polish messages for every validator.
 *
 * @example
 * ```ts
 * import {FpLocale, provideFormPulse} from 'ngx-formpulse';
 * import {fpLocalePl} from 'ngx-formpulse/locales/pl';
 *
 * provideFormPulse({locale: FpLocale.Pl, locales: [fpLocalePl]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export const fpLocalePl = {
  locale: FpLocale.Pl,
  messages: {
    fpPostCode: ({examples: [example]}) => (example === undefined
      ? 'Wpisz poprawny kod pocztowy.'
      : `Wpisz poprawny kod pocztowy, np. ${example}.`)
  }
} as const satisfies FpLocalePack;
