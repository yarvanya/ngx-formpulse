import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {FpCountry} from '../../../lib/enums/fp-country';
import {fpLocaleDe} from '../../../lib/locales/de/de';

describe('fpLocaleDe', () => {
  it('declares the de locale', () => {
    expect(fpLocaleDe.locale).toBe(FpLocale.De);
    expectTypeOf(fpLocaleDe.locale).toEqualTypeOf<FpLocale.De>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleDe).toExtend<FpLocalePack>();
  });

  it('translates fpPostCode with an example', () => {
    expect(fpLocaleDe.messages.fpPostCode({country: FpCountry.UA, examples: ['01001']})).toBe('Geben Sie eine gültige Postleitzahl ein, z. B. 01001.');
  });

  it('translates fpPostCode without an example', () => {
    expect(fpLocaleDe.messages.fpPostCode({country: null, examples: []})).toBe('Geben Sie eine gültige Postleitzahl ein.');
  });
});
