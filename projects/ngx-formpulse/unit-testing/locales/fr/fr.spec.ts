import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {fpLocaleFr} from '../../../lib/locales/fr/fr';

describe('fpLocaleFr', () => {
  it('declares the fr locale', () => {
    expect(fpLocaleFr.locale).toBe(FpLocale.Fr);
    expectTypeOf(fpLocaleFr.locale).toEqualTypeOf<FpLocale.Fr>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleFr).toExtend<FpLocalePack>();
  });

  it('has no messages before the first validator ships', () => {
    expect(Object.keys(fpLocaleFr.messages)).toEqual([]);
  });
});
