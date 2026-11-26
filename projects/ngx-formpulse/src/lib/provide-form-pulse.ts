import {type EnvironmentProviders, makeEnvironmentProviders, provideEnvironmentInitializer} from '@angular/core';
import {setFormPulseConfig} from './core/form-pulse-registry';
import type {FpFormPulseConfig} from './core/fp-form-pulse-config';

/**
 * Configures FormPulse for the whole application. Optional: without it every message is English.
 *
 * @param form_pulse_config - Default locale, locale packs to register, and message overrides.
 * @returns Environment providers for `bootstrapApplication` or `ApplicationConfig.providers`.
 *
 * @example
 * ```ts
 * import {FpLocale, provideFormPulse} from 'ngx-formpulse';
 * import {fpLocaleUk} from 'ngx-formpulse/locales/uk';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideFormPulse({locale: FpLocale.Uk, locales: [fpLocaleUk]})]
 * };
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#configuration
 */
export function provideFormPulse(form_pulse_config: FpFormPulseConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      setFormPulseConfig(form_pulse_config);
    })
  ]);
}
