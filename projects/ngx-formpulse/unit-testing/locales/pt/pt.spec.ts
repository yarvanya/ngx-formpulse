import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {FpCountry} from '../../../lib/enums/fp-country';
import {fpLocalePt} from '../../../lib/locales/pt/pt';

describe('fpLocalePt', () => {
  it('declares the pt locale', () => {
    expect(fpLocalePt.locale).toBe(FpLocale.Pt);
    expectTypeOf(fpLocalePt.locale).toEqualTypeOf<FpLocale.Pt>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocalePt).toExtend<FpLocalePack>();
  });

  it('translates fpPostCode with an example', () => {
    expect(fpLocalePt.messages.fpPostCode({country: FpCountry.UA, examples: ['01001']})).toBe('Insira um código postal válido, por exemplo 01001.');
  });

  it('translates fpPostCode without an example', () => {
    expect(fpLocalePt.messages.fpPostCode({country: null, examples: []})).toBe('Insira um código postal válido.');
  });

  it('translates fpEmail', () => {
    expect(fpLocalePt.messages.fpEmail).toBe('Insira um endereço de e-mail válido, por exemplo name@example.com.');
  });
});
