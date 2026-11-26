/**
 * Locales with built-in FormPulse messages.
 *
 * English is always available. Every other locale becomes available once its pack is registered
 * through {@link provideFormPulse}.
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
export enum FpLocale {
  En = 'en',
  Uk = 'uk',
  Es = 'es',
  Pt = 'pt',
  Pl = 'pl',
  De = 'de',
  Fr = 'fr'
}
