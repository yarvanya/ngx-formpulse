import type {FpErrorMap, FpValidatorKey} from '../../lib/core/fp-error-map';
import type {FpPostCodeError} from '../../lib/validators/post-code/post-code';

describe('FpErrorMap', () => {
  it('lists every validator key', () => {
    expectTypeOf<FpValidatorKey>().toEqualTypeOf<'fpPostCode'>();
  });

  it('maps each key to its error type', () => {
    expectTypeOf<FpErrorMap['fpPostCode']>().toEqualTypeOf<FpPostCodeError>();
  });
});
