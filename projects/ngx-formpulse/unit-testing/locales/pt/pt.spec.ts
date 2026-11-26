import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {fpLocalePt} from '../../../lib/locales/pt/pt';

describe('fpLocalePt', () => {
  it('declares the pt locale', () => {
    expect(fpLocalePt.locale).toBe(FpLocale.Pt);
    expectTypeOf(fpLocalePt.locale).toEqualTypeOf<FpLocale.Pt>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocalePt).toExtend<FpLocalePack>();
  });

  it('has no messages before the first validator ships', () => {
    expect(Object.keys(fpLocalePt.messages)).toEqual([]);
  });
});
