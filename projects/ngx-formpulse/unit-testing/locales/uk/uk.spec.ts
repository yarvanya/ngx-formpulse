import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {fpLocaleUk} from '../../../lib/locales/uk/uk';

describe('fpLocaleUk', () => {
  it('declares the uk locale', () => {
    expect(fpLocaleUk.locale).toBe(FpLocale.Uk);
    expectTypeOf(fpLocaleUk.locale).toEqualTypeOf<FpLocale.Uk>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleUk).toExtend<FpLocalePack>();
  });

  it('has no messages before the first validator ships', () => {
    expect(Object.keys(fpLocaleUk.messages)).toEqual([]);
  });
});
