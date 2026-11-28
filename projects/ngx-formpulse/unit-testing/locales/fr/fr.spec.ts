import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {FpCountry} from '../../../lib/enums/fp-country';
import {fpLocaleFr} from '../../../lib/locales/fr/fr';

describe('fpLocaleFr', () => {
  it('declares the fr locale', () => {
    expect(fpLocaleFr.locale).toBe(FpLocale.Fr);
    expectTypeOf(fpLocaleFr.locale).toEqualTypeOf<FpLocale.Fr>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleFr).toExtend<FpLocalePack>();
  });

  it('translates fpPostCode with an example', () => {
    expect(fpLocaleFr.messages.fpPostCode({country: FpCountry.UA, examples: ['01001']})).toBe('Saisissez un code postal valide, par exemple 01001.');
  });

  it('translates fpPostCode without an example', () => {
    expect(fpLocaleFr.messages.fpPostCode({country: null, examples: []})).toBe('Saisissez un code postal valide.');
  });

  it('translates fpEmail', () => {
    expect(fpLocaleFr.messages.fpEmail).toBe('Saisissez une adresse e-mail valide, par exemple name@example.com.');
  });

  it('translates fpRequired', () => {
    expect(fpLocaleFr.messages.fpRequired).toBe('Ce champ est obligatoire.');
  });
});
