import {isEmptyValue} from '../../lib/core/empty-value';
import type {FpError} from '../../lib/core/fp-error';
import {resolveMessage} from '../../lib/core/message-resolver';

export const TEST_VALIDATOR_KEY = 'fpTest';
export const EXPECTED_TEST_VALUE = 'expected';
export const UNEXPECTED_TEST_VALUE = 'unexpected';
export const TEST_ENGLISH_MESSAGE = 'Enter {expectedValue}.';

export type TestError = FpError<{expectedValue: string}>;

export function checkTestValue(control_value: unknown): TestError | null {
  if (isEmptyValue(control_value) || control_value === EXPECTED_TEST_VALUE) {
    return null;
  }
  const errorParameters = {expectedValue: EXPECTED_TEST_VALUE};
  const message = resolveMessage({
    validatorKey: TEST_VALIDATOR_KEY,
    englishMessage: TEST_ENGLISH_MESSAGE,
    errorParameters
  });
  return {...errorParameters, message};
}
