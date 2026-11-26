import type {FpFormPulseConfig} from '../../lib/core/fp-form-pulse-config';
import {FpLocale} from '../../lib/core/fp-locale';
import {fpLocaleUk} from '../../lib/locales/uk/uk';

describe('FpFormPulseConfig', () => {
  it('keeps every field optional', () => {
    expectTypeOf({}).toExtend<FpFormPulseConfig>();
  });

  it('accepts a default locale and locale packs', () => {
    expectTypeOf({locale: FpLocale.Uk, locales: [fpLocaleUk]}).toExtend<FpFormPulseConfig>();
  });

  it('accepts only FpLocale members as the default locale', () => {
    expectTypeOf<FpFormPulseConfig['locale']>().toEqualTypeOf<FpLocale | undefined>();
  });
});
