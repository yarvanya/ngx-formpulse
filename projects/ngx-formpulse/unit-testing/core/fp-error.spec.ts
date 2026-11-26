import type {FpError, FpErrorParameters} from '../../lib/core/fp-error';

type PostCodeError = FpError<{country: string; expectedFormat: string}>;

describe('FpError', () => {
  it('always carries a readonly message', () => {
    expectTypeOf<FpError>().toEqualTypeOf<Readonly<object> & {readonly message: string}>();
    expectTypeOf<PostCodeError['message']>().toEqualTypeOf<string>();
  });

  it('keeps validator-specific parameters', () => {
    expectTypeOf<PostCodeError>().toHaveProperty('expectedFormat').toEqualTypeOf<string>();
  });
});

describe('FpErrorParameters', () => {
  it('removes the message from the error parameters', () => {
    expectTypeOf<FpErrorParameters<PostCodeError>>().toEqualTypeOf<Omit<PostCodeError, 'message'>>();
    expectTypeOf<FpErrorParameters<PostCodeError>>().not.toHaveProperty('message');
  });
});
