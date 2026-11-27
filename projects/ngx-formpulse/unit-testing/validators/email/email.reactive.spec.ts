import {FormControl, type ValidatorFn} from '@angular/forms';
import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpEmailOptions} from '../../../lib/validators/email/email';
import {fpEmail} from '../../../lib/validators/email/email.reactive';
import {EMAIL_CASES} from '../../support/cases/email.cases';

describe('fpEmail (Reactive Forms)', () => {
  it.each(EMAIL_CASES)('$description: valid is $isValid', ({value, strict, isValid}) => {
    expect(new FormControl(value, [fpEmail({strict})]).valid).toBe(isValid);
  });

  it('reports the error under fpEmail without options', () => {
    expect(new FormControl('name@company', [fpEmail()]).errors).toEqual({fpEmail: {message: 'Enter a valid email address, e.g. name@example.com.'}});
  });

  it('never changes the control value', () => {
    const control = new FormControl(' name@example.com ', [fpEmail()]);
    expect(control.value).toBe(' name@example.com ');
  });

  it('accepts typed options only', () => {
    expectTypeOf(fpEmail).toBeCallableWith();
    expectTypeOf(fpEmail).toBeCallableWith({strict: true, locale: FpLocale.Uk, message: 'Wrong address.'});
    expectTypeOf<{strict: 'yes'}>().not.toExtend<FpEmailOptions>();
    expectTypeOf(fpEmail()).toEqualTypeOf<ValidatorFn>();
  });
});
