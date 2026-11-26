import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {form, type SchemaPath} from '@angular/forms/signals';
import {FpCountry} from '../../lib/enums/fp-country';
import {fpPostCode} from '../../lib/signals/post-code';
import {isString} from '../../lib/utilities/core.utility';
import type {FpPostCodeOptions} from '../../lib/validators/post-code/post-code';
import {fpPostCode as fpReactivePostCode} from '../../lib/validators/post-code/post-code.reactive';
import {POST_CODE_CASES} from '../support/cases/post-code.cases';

function createPostCodeField(initial_value: string | null, apply_validator: (schema_path: SchemaPath<string | null>) => void) {
  const model = signal<{postCode: string | null}>({postCode: initial_value});
  const signalForm = TestBed.runInInjectionContext(() => form(model, (schema_path) => {
    apply_validator(schema_path.postCode);
  }));
  return signalForm.postCode;
}

const STRING_CASES = POST_CODE_CASES.filter((post_code_case) => isString(post_code_case.value) || post_code_case.value === null);

describe('fpPostCode (Signal Forms)', () => {
  it.each(STRING_CASES)('$description: valid is $isValid', ({value, country, strict, isValid}) => {
    const initialValue = isString(value) ? value : null;
    const postCodeField = createPostCodeField(initialValue, (schema_path) => {
      fpPostCode(schema_path, country, {strict});
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

  it('follows a country read from a signal', () => {
    const country = signal<FpCountry | null>(FpCountry.PL);
    const postCodeField = createPostCodeField('00950', (schema_path) => {
      fpPostCode(schema_path, () => country());
    });
    expect(postCodeField().errors()).toMatchObject([{country: FpCountry.PL}]);
    country.set(FpCountry.UA);
    expect(postCodeField().errors()).toEqual([]);
    country.set(null);
    expect(postCodeField().errors()).toEqual([]);
  });

  it('follows options read from a signal', () => {
    const isStrict = signal(false);
    const postCodeField = createPostCodeField('sw1a 1aa', (schema_path) => {
      fpPostCode(schema_path, FpCountry.GB, () => ({strict: isStrict()}));
    });
    expect(postCodeField().errors()).toEqual([]);
    isStrict.set(true);
    expect(postCodeField().errors()).toHaveLength(1);
  });

  it('accepts options as a function without a country', () => {
    const postCodeField = createPostCodeField('%%%', (schema_path) => {
      fpPostCode(schema_path, () => ({message: 'Wrong code.'}));
    });
    expect(postCodeField().errors()).toMatchObject([{message: 'Wrong code.'}]);
  });

  it('reports the same payload as Reactive Forms', () => {
    const reactiveError: unknown = new FormControl('0100', [fpReactivePostCode(FpCountry.UA)]).errors?.['fpPostCode'];
    const [validationError] = createPostCodeField('0100', (schema_path) => {
      fpPostCode(schema_path, FpCountry.UA);
    })().errors();
    expect(reactiveError).toEqual({country: FpCountry.UA, examples: ['15432', '01055', '01001'], message: 'Enter a valid postal code, e.g. 15432.'});
    expect(validationError).toMatchObject({kind: 'fpPostCode', country: FpCountry.UA, examples: ['15432', '01055', '01001'], message: 'Enter a valid postal code, e.g. 15432.'});
  });

  it('types the parameters', () => {
    expectTypeOf<Parameters<typeof fpPostCode<string>>[1]>().toEqualTypeOf<FpCountry | null | (() => FpCountry | null)>();
    expectTypeOf<Parameters<typeof fpPostCode<string>>[2]>().toEqualTypeOf<FpPostCodeOptions | (() => FpPostCodeOptions) | undefined>();
    expectTypeOf<'UA'>().not.toExtend<Parameters<typeof fpPostCode<string>>[1]>();
    expectTypeOf<SchemaPath<number>>().not.toExtend<SchemaPath<string | null | undefined>>();
  });
});
