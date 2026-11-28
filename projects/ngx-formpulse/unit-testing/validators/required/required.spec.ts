import {FpLocale} from '../../../lib/core/fp-locale';
import {resetFormPulseConfig, setFormPulseConfig} from '../../../lib/core/form-pulse-registry';
import {fpLocaleUk} from '../../../lib/locales/uk/uk';
import {checkRequired, type FpRequiredError, isMissingValue} from '../../../lib/validators/required/required';
import {REQUIRED_CASES} from '../../support/cases/required.cases';

const ENGLISH_MESSAGE = 'This field is required.';

describe('isMissingValue', () => {
  it.each(REQUIRED_CASES)('$description ($valueLabel): missing is not $isValid', ({value, isValid}) => {
    expect(isMissingValue(value)).toBe(!isValid);
  });

  it('treats functions and symbols as filled', () => {
    expect(isMissingValue(() => 'value')).toBe(false);
    expect(isMissingValue(Symbol('value'))).toBe(false);
  });
});

describe('checkRequired', () => {
  afterEach(() => {
    resetFormPulseConfig();
  });

  it.each(REQUIRED_CASES)('$description ($valueLabel): valid is $isValid', ({value, isValid}) => {
    expect(checkRequired(value, {}) === null).toBe(isValid);
  });

  it('reports an English message only', () => {
    expect(checkRequired('', {})).toEqual({message: ENGLISH_MESSAGE});
  });

  it('uses the locale pack of the inline locale', () => {
    setFormPulseConfig({locales: [fpLocaleUk]});
    expect(checkRequired(null, {locale: FpLocale.Uk})).toEqual({message: 'Це поле обов’язкове.'});
  });

  it('prefers an inline message', () => {
    expect(checkRequired(null, {message: 'Enter your name.'})).toEqual({message: 'Enter your name.'});
  });

  it('types the error as a message only', () => {
    expectTypeOf<FpRequiredError>().toEqualTypeOf<Readonly<object> & {readonly message: string}>();
  });
});
