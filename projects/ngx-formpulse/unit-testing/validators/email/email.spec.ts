import {FpLocale} from '../../../lib/core/fp-locale';
import {resetFormPulseConfig, setFormPulseConfig} from '../../../lib/core/form-pulse-registry';
import {fpLocaleUk} from '../../../lib/locales/uk/uk';
import {checkEmail, type FpEmailError} from '../../../lib/validators/email/email';
import {EMAIL_CASES} from '../../support/cases/email.cases';

const ENGLISH_MESSAGE = 'Enter a valid email address, e.g. name@example.com.';
const INVALID_EMAIL = 'name@company';

describe('checkEmail', () => {
  afterEach(() => {
    resetFormPulseConfig();
  });

  it.each(EMAIL_CASES)('$description: valid is $isValid', ({value, strict, isValid}) => {
    expect(checkEmail(value, {strict}) === null).toBe(isValid);
  });

  it('reports an English message only', () => {
    expect(checkEmail(INVALID_EMAIL, {})).toEqual({message: ENGLISH_MESSAGE});
  });

  it('uses the locale pack of the inline locale', () => {
    setFormPulseConfig({locales: [fpLocaleUk]});
    expect(checkEmail(INVALID_EMAIL, {locale: FpLocale.Uk})).toEqual({message: 'Введіть коректну адресу електронної пошти, наприклад name@example.com.'});
  });

  it('prefers an inline message', () => {
    expect(checkEmail(INVALID_EMAIL, {message: 'Check the email address.'})).toEqual({message: 'Check the email address.'});
  });

  it('types the error as a message only', () => {
    expectTypeOf<FpEmailError>().toEqualTypeOf<Readonly<object> & {readonly message: string}>();
  });
});
