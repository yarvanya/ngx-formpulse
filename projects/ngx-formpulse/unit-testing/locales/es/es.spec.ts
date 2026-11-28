import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpLocalePack} from '../../../lib/core/fp-locale-pack';
import {FpCountry} from '../../../lib/enums/fp-country';
import {fpLocaleEs} from '../../../lib/locales/es/es';

describe('fpLocaleEs', () => {
  it('declares the es locale', () => {
    expect(fpLocaleEs.locale).toBe(FpLocale.Es);
    expectTypeOf(fpLocaleEs.locale).toEqualTypeOf<FpLocale.Es>();
  });

  it('satisfies FpLocalePack', () => {
    expectTypeOf(fpLocaleEs).toExtend<FpLocalePack>();
  });

  it('translates fpPostCode with an example', () => {
    expect(fpLocaleEs.messages.fpPostCode({country: FpCountry.UA, examples: ['01001']})).toBe('Introduce un código postal válido, por ejemplo 01001.');
  });

  it('translates fpPostCode without an example', () => {
    expect(fpLocaleEs.messages.fpPostCode({country: null, examples: []})).toBe('Introduce un código postal válido.');
  });

  it('translates fpEmail', () => {
    expect(fpLocaleEs.messages.fpEmail).toBe('Introduce un correo electrónico válido, por ejemplo name@example.com.');
  });

  it('translates fpRequired', () => {
    expect(fpLocaleEs.messages.fpRequired).toBe('Este campo es obligatorio.');
  });
});
