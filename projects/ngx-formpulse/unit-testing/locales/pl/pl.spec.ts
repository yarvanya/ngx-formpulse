import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {FpCountry} from '../../../lib/enums/fp-country';
import {fpLocalePl} from '../../../lib/locales/pl/pl';

describe('fpLocalePl', () => {
  it('declares the pl locale', () => {
    expect(fpLocalePl.locale).toBe(FpLocale.Pl);
    expectTypeOf(fpLocalePl.locale).toEqualTypeOf<FpLocale.Pl>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocalePl).toExtend<FpLocalePack>();
  });

  it('translates fpPostCode with an example', () => {
    expect(fpLocalePl.messages.fpPostCode({country: FpCountry.UA, examples: ['01001']})).toBe('Wpisz poprawny kod pocztowy, np. 01001.');
  });

  it('translates fpPostCode without an example', () => {
    expect(fpLocalePl.messages.fpPostCode({country: null, examples: []})).toBe('Wpisz poprawny kod pocztowy.');
  });
});
