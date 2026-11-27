import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {form, type SchemaPath} from '@angular/forms/signals';
import {fpEmail} from '../../lib/signals/email';
import {isString} from '../../lib/utilities/core.utility';
import type {FpEmailOptions} from '../../lib/validators/email/email';
import {fpEmail as fpReactiveEmail} from '../../lib/validators/email/email.reactive';
import {EMAIL_CASES} from '../support/cases/email.cases';

const ENGLISH_MESSAGE = 'Enter a valid email address, e.g. name@example.com.';

function createEmailField(initial_value: string | null, apply_validator: (schema_path: SchemaPath<string | null>) => void) {
  const model = signal<{email: string | null}>({email: initial_value});
  const signalForm = TestBed.runInInjectionContext(() => form(model, (schema_path) => {
    apply_validator(schema_path.email);
  }));
  return signalForm.email;
}

const STRING_CASES = EMAIL_CASES.filter((email_case) => isString(email_case.value) || email_case.value === null);

describe('fpEmail (Signal Forms)', () => {
  it.each(STRING_CASES)('$description: valid is $isValid', ({value, strict, isValid}) => {
    const initialValue = isString(value) ? value : null;
    const emailField = createEmailField(initialValue, (schema_path) => {
      fpEmail(schema_path, {strict});
    });
    expect(emailField().errors().length === 0).toBe(isValid);
  });

  it('follows options read from a signal', () => {
    const isStrict = signal(false);
    const emailField = createEmailField(' name@example.com ', (schema_path) => {
      fpEmail(schema_path, () => ({strict: isStrict()}));
    });
    expect(emailField().errors()).toEqual([]);
    isStrict.set(true);
    expect(emailField().errors()).toHaveLength(1);
  });

  it('reports the same payload as Reactive Forms', () => {
    const reactiveError: unknown = new FormControl('name@company', [fpReactiveEmail()]).errors?.['fpEmail'];
    const [validationError] = createEmailField('name@company', (schema_path) => {
      fpEmail(schema_path);
    })().errors();
    expect(reactiveError).toEqual({message: ENGLISH_MESSAGE});
    expect(validationError).toMatchObject({kind: 'fpEmail', message: ENGLISH_MESSAGE});
  });

  it('types the parameters', () => {
    expectTypeOf<Parameters<typeof fpEmail<string>>[1]>().toEqualTypeOf<FpEmailOptions | (() => FpEmailOptions) | undefined>();
    expectTypeOf<SchemaPath<number>>().not.toExtend<SchemaPath<string | null | undefined>>();
  });
});
