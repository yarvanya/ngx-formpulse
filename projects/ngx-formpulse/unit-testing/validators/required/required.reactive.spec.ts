import {FormControl, type ValidatorFn} from '@angular/forms';
import {FpLocale} from '../../../lib/core/fp-locale';
import type {FpRequiredOptions} from '../../../lib/validators/required/required';
import {fpRequired} from '../../../lib/validators/required/required.reactive';
import {REQUIRED_CASES} from '../../support/cases/required.cases';

describe('fpRequired (Reactive Forms)', () => {
  it.each(REQUIRED_CASES)('$description ($valueLabel): valid is $isValid', ({value, isValid}) => {
    expect(new FormControl(value, [fpRequired()]).valid).toBe(isValid);
  });

  it('reports the error under fpRequired', () => {
    expect(new FormControl('   ', [fpRequired()]).errors).toEqual({fpRequired: {message: 'This field is required.'}});
  });

  it('never changes the control value', () => {
    const control = new FormControl('   ', [fpRequired()]);
    expect(control.value).toBe('   ');
  });

  it('accepts typed options only', () => {
    expectTypeOf(fpRequired).toBeCallableWith();
    expectTypeOf(fpRequired).toBeCallableWith({locale: FpLocale.Uk, message: 'Enter your name.'});
    expectTypeOf<{strict: true}>().not.toExtend<FpRequiredOptions>();
    expectTypeOf(fpRequired()).toEqualTypeOf<ValidatorFn>();
  });
});
