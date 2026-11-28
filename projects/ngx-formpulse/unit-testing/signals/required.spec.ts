import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {form, type SchemaPath} from '@angular/forms/signals';
import {fpRequired} from '../../lib/signals/required';
import type {FpRequiredOptions} from '../../lib/validators/required/required';
import {fpRequired as fpReactiveRequired} from '../../lib/validators/required/required.reactive';
import {REQUIRED_CASES} from '../support/cases/required.cases';

const ENGLISH_MESSAGE = 'This field is required.';

function createRequiredField(initial_value: unknown, apply_validator: (schema_path: SchemaPath<unknown>) => void) {
  const model = signal<unknown>(initial_value);
  return TestBed.runInInjectionContext(() => form(model, (schema_path) => {
    apply_validator(schema_path);
  }));
}

describe('fpRequired (Signal Forms)', () => {
  it.each(REQUIRED_CASES)('$description ($valueLabel): valid is $isValid', ({value, isValid}) => {
    const requiredField = createRequiredField(value, (schema_path) => {
      fpRequired(schema_path);
    });
    expect(requiredField().errors().length === 0).toBe(isValid);
  });

  it('marks the field as required', () => {
    const requiredField = createRequiredField('Ivan', (schema_path) => {
      fpRequired(schema_path);
    });
    expect(requiredField().required()).toBe(true);
  });

  it('follows options read from a signal', () => {
    const message = signal('Enter your name.');
    const requiredField = createRequiredField('', (schema_path) => {
      fpRequired(schema_path, () => ({message: message()}));
    });
    expect(requiredField().errors()).toMatchObject([{message: 'Enter your name.'}]);
    message.set('Enter a quantity.');
    expect(requiredField().errors()).toMatchObject([{message: 'Enter a quantity.'}]);
  });

  it('reports the same payload as Reactive Forms', () => {
    const reactiveError: unknown = new FormControl(null, [fpReactiveRequired()]).errors?.['fpRequired'];
    const [validationError] = createRequiredField(null, (schema_path) => {
      fpRequired(schema_path);
    })().errors();
    expect(reactiveError).toEqual({message: ENGLISH_MESSAGE});
    expect(validationError).toMatchObject({kind: 'fpRequired', message: ENGLISH_MESSAGE});
  });

  it('types the parameters', () => {
    expectTypeOf<Parameters<typeof fpRequired<number>>[1]>().toEqualTypeOf<FpRequiredOptions | (() => FpRequiredOptions) | undefined>();
    expectTypeOf<Parameters<typeof fpRequired<boolean[]>>[0]>().toEqualTypeOf<SchemaPath<boolean[]>>();
  });
});
