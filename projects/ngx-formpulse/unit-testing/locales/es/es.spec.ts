import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {fpLocaleEs} from '../../../lib/locales/es/es';

describe('fpLocaleEs', () => {
  it('declares the es locale', () => {
    expect(fpLocaleEs.locale).toBe(FpLocale.Es);
    expectTypeOf(fpLocaleEs.locale).toEqualTypeOf<FpLocale.Es>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleEs).toExtend<FpLocalePack>();
  });

  it('has no messages before the first validator ships', () => {
    expect(Object.keys(fpLocaleEs.messages)).toEqual([]);
  });
});
