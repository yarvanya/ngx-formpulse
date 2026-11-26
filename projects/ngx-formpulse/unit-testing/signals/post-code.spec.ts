import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {form, type SchemaPath} from '@angular/forms/signals';
import {FpCountry} from '../../lib/enums/fp-country';
import {fpPostCode} from '../../lib/signals/post-code';
import {fpPostCode as fpReactivePostCode} from '../../lib/validators/post-code/post-code.reactive';
import {POST_CODE_CASES} from '../support/cases/post-code.cases';

function createPostCodeField(initial_value: string | null, apply_validator: (schema_path: SchemaPath<string | null>) => void) {
  const model = signal<{postCode: string | null}>({postCode: initial_value});
  const signalForm = TestBed.runInInjectionContext(() => form(model, (schema_path) => {
    apply_validator(schema_path.postCode);
  }));
  return signalForm.postCode;
}

const STRING_CASES = POST_CODE_CASES.filter((post_code_case) => typeof post_code_case.value !== 'number');

describe('fpPostCode (Signal Forms)', () => {
  it.each(STRING_CASES)('$description: valid is $isValid', ({value, country, strict, isValid}) => {
    const initialValue = typeof value === 'string' ? value : null;
    const postCodeField = createPostCodeField(initialValue, (schema_path) => {
      if (country === null) {
        fpPostCode(schema_path, {strict});
      } else {
        fpPostCode(schema_path, country, {strict});
      }
    });
    expect(postCodeField().errors().length === 0).toBe(isValid);
  });

  it('validates any country without arguments', () => {
    const [validationError] = createPostCodeField('%%%', (schema_path) => {
      fpPostCode(schema_path);
    })().errors();
    expect(validationError).toMatchObject({kind: 'fpPostCode', country: null, examples: [], message: 'Enter a valid postal code.'});
  });

  it('validates one country without options', () => {
    expect(createPostCodeField('0100', (schema_path) => {
      fpPostCode(schema_path, FpCountry.UA);
    })().errors()).toHaveLength(1);
  });

  it('reports the same payload as Reactive Forms', () => {
    const reactiveErrors = new FormControl('0100', [fpReactivePostCode(FpCountry.UA)]).errors;
    const [validationError] = createPostCodeField('0100', (schema_path) => {
      fpPostCode(schema_path, FpCountry.UA);
    })().errors();
    expect(validationError).toMatchObject({...reactiveErrors?.['fpPostCode'], kind: 'fpPostCode'});
  });
});
