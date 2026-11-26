import type {FpError, FpErrorParameters} from '../../lib/core/fp-error';
import type {FpMessage} from '../../lib/core/fp-message';

type PostCodeError = FpError<{expectedFormat: string}>;

describe('FpMessage', () => {
  it('accepts a string', () => {
    expectTypeOf<string>().toExtend<FpMessage<PostCodeError>>();
  });

  it('accepts a function of the error parameters', () => {
    expectTypeOf<(error_parameters: FpErrorParameters<PostCodeError>) => string>().toExtend<FpMessage<PostCodeError>>();
  });

  it('rejects a function returning something other than a string', () => {
    expectTypeOf<(error_parameters: FpErrorParameters<PostCodeError>) => number>().not.toExtend<FpMessage<PostCodeError>>();
  });
});
