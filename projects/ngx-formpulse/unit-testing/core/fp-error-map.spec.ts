import type {FpErrorMap, FpValidatorKey} from '../../lib/core/fp-error-map';
import type {FpEmailError} from '../../lib/validators/email/email';
import type {FpPostCodeError} from '../../lib/validators/post-code/post-code';
import type {FpRequiredError} from '../../lib/validators/required/required';

describe('FpErrorMap', () => {
  it('lists every validator key', () => {
    expectTypeOf<FpValidatorKey>().toEqualTypeOf<'fpEmail' | 'fpPostCode' | 'fpRequired'>();
  });

  it('maps each key to its error type', () => {
    expectTypeOf<FpErrorMap['fpEmail']>().toEqualTypeOf<FpEmailError>();
    expectTypeOf<FpErrorMap['fpPostCode']>().toEqualTypeOf<FpPostCodeError>();
    expectTypeOf<FpErrorMap['fpRequired']>().toEqualTypeOf<FpRequiredError>();
  });
});
