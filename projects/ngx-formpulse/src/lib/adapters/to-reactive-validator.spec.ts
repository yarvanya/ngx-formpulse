import {FormControl} from '@angular/forms';
import {checkTestValue, EXPECTED_TEST_VALUE, TEST_VALIDATOR_KEY, UNEXPECTED_TEST_VALUE} from '../testing/test-value-check';
import {toReactiveValidator} from './to-reactive-validator';

describe('toReactiveValidator', () => {
  it('returns null for a valid value', () => {
    const control = new FormControl(EXPECTED_TEST_VALUE, [toReactiveValidator(TEST_VALIDATOR_KEY, checkTestValue)]);
    expect(control.errors).toBeNull();
  });

  it('returns null for an empty value', () => {
    const control = new FormControl('', [toReactiveValidator(TEST_VALIDATOR_KEY, checkTestValue)]);
    expect(control.errors).toBeNull();
  });

  it('puts the error under the validator key', () => {
    const control = new FormControl(UNEXPECTED_TEST_VALUE, [toReactiveValidator(TEST_VALIDATOR_KEY, checkTestValue)]);
    expect(control.errors).toEqual({[TEST_VALIDATOR_KEY]: checkTestValue(UNEXPECTED_TEST_VALUE)});
  });

  it('never changes the control value', () => {
    const control = new FormControl(UNEXPECTED_TEST_VALUE, [toReactiveValidator(TEST_VALIDATOR_KEY, checkTestValue)]);
    expect(control.value).toBe(UNEXPECTED_TEST_VALUE);
  });
});
