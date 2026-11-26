import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {fpLocalePl} from '../../../lib/locales/pl/pl';

describe('fpLocalePl', () => {
  it('declares the pl locale', () => {
    expect(fpLocalePl.locale).toBe(FpLocale.Pl);
    expectTypeOf(fpLocalePl.locale).toEqualTypeOf<FpLocale.Pl>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocalePl).toExtend<FpLocalePack>();
  });

  it('has no messages before the first validator ships', () => {
    expect(Object.keys(fpLocalePl.messages)).toEqual([]);
  });
});
