import {FormControl, type ValidatorFn} from '@angular/forms';
import {FpLocale} from '../../../lib/core/fp-locale';
import {FpCountry} from '../../../lib/enums/fp-country';
import type {FpPostCodeOptions} from '../../../lib/validators/post-code/post-code';
import {fpPostCode} from '../../../lib/validators/post-code/post-code.reactive';
import {POST_CODE_CASES} from '../../support/cases/post-code.cases';

describe('fpPostCode (Reactive Forms)', () => {
  it.each(POST_CODE_CASES)('$description: valid is $isValid', ({value, country, strict, isValid}) => {
    const validator = country === null ? fpPostCode({strict}) : fpPostCode(country, {strict});
    expect(new FormControl(value, [validator]).valid).toBe(isValid);
  });

  it('validates any country without arguments', () => {
    expect(new FormControl('%%%', [fpPostCode()]).errors).toEqual({fpPostCode: {country: null, examples: [], message: 'Enter a valid postal code.'}});
  });

  it('validates one country without options', () => {
    expect(new FormControl('0100', [fpPostCode(FpCountry.UA)]).hasError('fpPostCode')).toBe(true);
  });

  it('never changes the control value', () => {
    const control = new FormControl(' sw1a 1aa ', [fpPostCode(FpCountry.GB)]);
    expect(control.value).toBe(' sw1a 1aa ');
  });

  it('treats a null country as any country and keeps the options', () => {
    const control = new FormControl('sw1a 1aa', [fpPostCode(null, {strict: true})]);
    expect(control.errors).toEqual({fpPostCode: {country: null, examples: [], message: 'Enter a valid postal code.'}});
  });

  it('accepts only FpCountry members, null and typed options', () => {
    expectTypeOf(fpPostCode).toBeCallableWith();
    expectTypeOf(fpPostCode).toBeCallableWith(FpCountry.UA);
    expectTypeOf(fpPostCode).toBeCallableWith(null);
    expectTypeOf(fpPostCode).toBeCallableWith(FpCountry.UA, {strict: true, locale: FpLocale.Uk});
    expectTypeOf(fpPostCode).toBeCallableWith(null, {strict: true});
    expectTypeOf(fpPostCode).toBeCallableWith({message: 'Wrong code.'});
    expectTypeOf<'UA'>().not.toExtend<FpCountry | FpPostCodeOptions | null | undefined>();
    expectTypeOf<{strict: 'yes'}>().not.toExtend<FpPostCodeOptions>();
    expectTypeOf(fpPostCode(FpCountry.UA)).toEqualTypeOf<ValidatorFn>();
  });
});
