import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {fpLocaleDe} from '../../../lib/locales/de/de';

describe('fpLocaleDe', () => {
  it('declares the de locale', () => {
    expect(fpLocaleDe.locale).toBe(FpLocale.De);
    expectTypeOf(fpLocaleDe.locale).toEqualTypeOf<FpLocale.De>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleDe).toExtend<FpLocalePack>();
  });

  it('has no messages before the first validator ships', () => {
    expect(Object.keys(fpLocaleDe.messages)).toEqual([]);
  });
});
