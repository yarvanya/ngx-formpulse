import type {FpLocale} from '../../lib/core/fp-locale';
import type {FpLocaleMessages, FpLocalePack} from '../../lib/core/fp-locale-pack';
import type {FpMessage} from '../../lib/core/fp-message';
import type {FpEmailError} from '../../lib/validators/email/email';
import type {FpPostCodeError} from '../../lib/validators/post-code/post-code';
import type {FpRequiredError} from '../../lib/validators/required/required';

describe('FpLocalePack', () => {
  it('requires a message for every validator', () => {
    expectTypeOf<FpLocaleMessages>().toEqualTypeOf<{readonly fpEmail: FpMessage<FpEmailError>; readonly fpPostCode: FpMessage<FpPostCodeError>; readonly fpRequired: FpMessage<FpRequiredError>}>();
    expectTypeOf({}).not.toExtend<FpLocaleMessages>();
  });

  it('pairs a locale with its messages', () => {
    expectTypeOf<FpLocalePack['locale']>().toEqualTypeOf<FpLocale>();
    expectTypeOf<FpLocalePack['messages']>().toEqualTypeOf<FpLocaleMessages>();
  });
});
