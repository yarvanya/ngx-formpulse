import {warnOnceInDevelopment} from './development-warning';
import type {FpFormPulseConfig} from './fp-form-pulse-config';
import {FpLocale} from './fp-locale';
import type {FpLocalePack} from './fp-locale-pack';

export function findLocalePack(requested_locale: FpLocale, form_pulse_config: FpFormPulseConfig): FpLocalePack | undefined {
  return form_pulse_config.locales?.find((locale_pack) => locale_pack.locale === requested_locale);
}

function readAvailableLocale(requested_locale: FpLocale | undefined, form_pulse_config: FpFormPulseConfig): FpLocale | undefined {
  if (requested_locale === undefined) {
    return undefined;
  }
  if (requested_locale === FpLocale.En || findLocalePack(requested_locale, form_pulse_config) !== undefined) {
    return requested_locale;
  }
  warnOnceInDevelopment(`Locale "${requested_locale}" has no registered pack, so another locale is used. Register it with provideFormPulse({locales: [...]}).`);
  return undefined;
}

export function resolveLocale(inline_locale: FpLocale | undefined, form_pulse_config: FpFormPulseConfig): FpLocale {
  return readAvailableLocale(inline_locale, form_pulse_config)
    ?? readAvailableLocale(form_pulse_config.locale, form_pulse_config)
    ?? FpLocale.En;
}
