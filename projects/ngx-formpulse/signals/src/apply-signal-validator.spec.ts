import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {form} from '@angular/forms/signals';
import {toReactiveValidator} from '../../src/lib/adapters/to-reactive-validator';
import {checkTestValue, EXPECTED_TEST_VALUE, TEST_VALIDATOR_KEY, UNEXPECTED_TEST_VALUE} from '../../src/lib/testing/test-value-check';
import {applySignalValidator} from './apply-signal-validator';

function createSignalField(initial_value: string) {
  const model = signal({postalCode: initial_value});
  const signalForm = TestBed.runInInjectionContext(() => form(model, (schema_path) => {
    applySignalValidator(schema_path.postalCode, TEST_VALIDATOR_KEY, checkTestValue);
  }));
  return signalForm.postalCode;
}

describe('applySignalValidator', () => {
  it('reports no errors for a valid value', () => {
    expect(createSignalField(EXPECTED_TEST_VALUE)().errors()).toEqual([]);
  });

  it('reports no errors for an empty value', () => {
    expect(createSignalField('')().errors()).toEqual([]);
  });

  it('reports the payload with the validator key as kind', () => {
    const [validationError] = createSignalField(UNEXPECTED_TEST_VALUE)().errors();
    expect(validationError).toMatchObject({kind: TEST_VALIDATOR_KEY, ...checkTestValue(UNEXPECTED_TEST_VALUE)});
  });

  it('produces the same payload as the Reactive Forms adapter', () => {
    const expectedPayload = checkTestValue(UNEXPECTED_TEST_VALUE);
    const control = new FormControl(UNEXPECTED_TEST_VALUE, [toReactiveValidator(TEST_VALIDATOR_KEY, checkTestValue)]);
    const [validationError] = createSignalField(UNEXPECTED_TEST_VALUE)().errors();
    expect(control.errors).toEqual({[TEST_VALIDATOR_KEY]: expectedPayload});
    expect(validationError).toMatchObject({...expectedPayload, kind: TEST_VALIDATOR_KEY});
  });
});
