import {FpLocale, type FpLocalePack} from 'ngx-formpulse';

/**
 * FormPulse locale pack: French messages for every validator.
 *
 * @example
 * ```ts
 * import {FpLocale, provideFormPulse} from 'ngx-formpulse';
 * import {fpLocaleFr} from 'ngx-formpulse/locales/fr';
 *
 * provideFormPulse({locale: FpLocale.Fr, locales: [fpLocaleFr]});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#localization
 */
export const fpLocaleFr = {
  locale: FpLocale.Fr,
  messages: {
    fpPostCode: ({examples: [example]}) => (example === undefined
      ? 'Saisissez un code postal valide.'
      : `Saisissez un code postal valide, par exemple ${example}.`),
    fpEmail: 'Saisissez une adresse e-mail valide, par exemple name@example.com.',
    fpRequired: 'Ce champ est obligatoire.'
  }
} as const satisfies FpLocalePack;
