import {FpLocale} from './fp-locale';

describe('FpLocale', () => {
  it('lists the seven shipped locales by their ISO 639-1 codes', () => {
    expect(Object.values(FpLocale)).toEqual(['en', 'uk', 'es', 'pt', 'pl', 'de', 'fr']);
  });
});
