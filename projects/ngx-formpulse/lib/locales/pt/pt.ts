import {FpLocale, type FpLocalePack} from 'ngx-formpulse';

/**
 * FormPulse locale pack: Portuguese messages for every validator.
 *
 * @example
 * ```ts
 * import {FpLocale, provideFormPulse} from 'ngx-formpulse';
 * import {fpLocalePt} from 'ngx-formpulse/locales/pt';
 *
 * provideFormPulse({locale: FpLocale.Pt, locales: [fpLocalePt]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export const fpLocalePt = {
  locale: FpLocale.Pt,
  messages: {
    fpPostCode: ({examples: [example]}) => (example === undefined
      ? 'Insira um código postal válido.'
      : `Insira um código postal válido, por exemplo ${example}.`)
  }
} as const satisfies FpLocalePack;
