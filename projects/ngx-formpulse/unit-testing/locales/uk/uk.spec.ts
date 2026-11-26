import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {FpCountry} from '../../../lib/enums/fp-country';
import {fpLocaleUk} from '../../../lib/locales/uk/uk';

describe('fpLocaleUk', () => {
  it('declares the uk locale', () => {
    expect(fpLocaleUk.locale).toBe(FpLocale.Uk);
    expectTypeOf(fpLocaleUk.locale).toEqualTypeOf<FpLocale.Uk>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleUk).toExtend<FpLocalePack>();
  });

  it('translates fpPostCode with an example', () => {
    expect(fpLocaleUk.messages.fpPostCode({country: FpCountry.UA, examples: ['01001']})).toBe('Введіть коректний поштовий індекс, наприклад 01001.');
  });

  it('translates fpPostCode without an example', () => {
    expect(fpLocaleUk.messages.fpPostCode({country: null, examples: []})).toBe('Введіть коректний поштовий індекс.');
  });
});
