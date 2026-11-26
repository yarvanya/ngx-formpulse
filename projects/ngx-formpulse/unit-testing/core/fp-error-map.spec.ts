import type {FpValidatorKey} from '../../lib/core/fp-error-map';

describe('FpErrorMap', () => {
  it('has no validator keys before the first validator ships', () => {
    expectTypeOf<FpValidatorKey>().toBeNever();
  });
});
