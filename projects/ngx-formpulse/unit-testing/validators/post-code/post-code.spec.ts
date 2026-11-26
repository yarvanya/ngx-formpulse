import {resetDevelopmentWarnings} from '../../../lib/core/development-warning';
import {FpLocale} from '../../../lib/core/fp-locale';
import {resetFormPulseConfig, setFormPulseConfig} from '../../../lib/core/form-pulse-registry';
import {FpCountry} from '../../../lib/enums/fp-country';
import {fpLocaleUk} from '../../../lib/locales/uk/uk';
import {checkPostCode, type FpPostCodeError, readPostCodeArguments} from '../../../lib/validators/post-code/post-code';
import {POST_CODE_CASES} from '../../support/cases/post-code.cases';

const UKRAINIAN_FIRST_EXAMPLE = '15432';
const INVALID_UKRAINIAN_VALUE = '0100';

function checkWithUntypedCountry(untyped_country: string): unknown {
  return Reflect.apply(checkPostCode, undefined, ['ANYTHING', untyped_country, {}]);
}

describe('checkPostCode', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    resetFormPulseConfig();
    resetDevelopmentWarnings();
    vi.restoreAllMocks();
  });

  it.each(POST_CODE_CASES)('$description: valid is $isValid', ({value, country, strict, isValid}) => {
    expect(checkPostCode(value, country, {strict}) === null).toBe(isValid);
  });

  it('reports the country and its examples with an English message', () => {
    expect(checkPostCode(INVALID_UKRAINIAN_VALUE, FpCountry.UA, {})).toEqual({
      country: FpCountry.UA,
      examples: [UKRAINIAN_FIRST_EXAMPLE, '01055', '01001'],
      message: `Enter a valid postal code, e.g. ${UKRAINIAN_FIRST_EXAMPLE}.`
    });
  });

  it('reports a null country and no examples in any-country mode', () => {
    expect(checkPostCode('%%%', null, {})).toEqual({country: null, examples: [], message: 'Enter a valid postal code.'});
  });

  it('reports a blank value for a country without postal codes without examples', () => {
    expect(checkPostCode('   ', FpCountry.AE, {})).toEqual({country: FpCountry.AE, examples: [], message: 'Enter a valid postal code.'});
  });

  it('uses the generic message when the country has no examples', () => {
    expect(checkPostCode('1234', FpCountry.CC, {})?.message).toBe('Enter a valid postal code.');
  });

  it('uses the inline message and locale', () => {
    setFormPulseConfig({locales: [fpLocaleUk]});
    expect(checkPostCode(INVALID_UKRAINIAN_VALUE, FpCountry.UA, {locale: FpLocale.Uk})?.message).toBe(`Введіть коректний поштовий індекс, наприклад ${UKRAINIAN_FIRST_EXAMPLE}.`);
    expect(checkPostCode(INVALID_UKRAINIAN_VALUE, FpCountry.UA, {message: 'Wrong code, try {examples}.'})?.message).toBe('Wrong code, try 15432, 01055, 01001.');
  });

  it.each(['constructor', '__proto__', 'XX'])('accepts any value and warns for the unknown country "%s" without throwing', (untyped_country) => {
    expect(checkWithUntypedCountry(untyped_country)).toBeNull();
    expect(console.warn).toHaveBeenCalledExactlyOnceWith(`[FormPulse] fpPostCode received "${untyped_country}", which is not an FpCountry member, so any value is accepted.`);
  });

  it('does not warn for a known country', () => {
    checkPostCode(INVALID_UKRAINIAN_VALUE, FpCountry.UA, {});
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('types the error', () => {
    expectTypeOf(checkPostCode).returns.toEqualTypeOf<FpPostCodeError | null>();
    expectTypeOf<FpPostCodeError['country']>().toEqualTypeOf<FpCountry | null>();
    expectTypeOf<FpPostCodeError['examples']>().toEqualTypeOf<readonly string[]>();
  });
});

describe('readPostCodeArguments', () => {
  it('reads a country with options', () => {
    expect(readPostCodeArguments(FpCountry.UA, {strict: true})).toEqual([FpCountry.UA, {strict: true}]);
  });

  it('reads a country without options', () => {
    expect(readPostCodeArguments(FpCountry.UA, undefined)).toEqual([FpCountry.UA, {}]);
  });

  it('reads a null country with options', () => {
    expect(readPostCodeArguments(null, {strict: true})).toEqual([null, {strict: true}]);
  });

  it('reads options without a country', () => {
    expect(readPostCodeArguments({strict: true}, undefined)).toEqual([null, {strict: true}]);
  });

  it('keeps the options when the country is undefined', () => {
    expect(readPostCodeArguments(undefined, {strict: true})).toEqual([null, {strict: true}]);
  });

  it('reads no arguments', () => {
    expect(readPostCodeArguments(undefined, undefined)).toEqual([null, {}]);
  });
});
