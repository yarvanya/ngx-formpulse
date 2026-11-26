import type {FpLocale} from '../../lib/core/fp-locale';
import type {FpBaseOptions} from '../../lib/core/fp-options';

describe('FpBaseOptions', () => {
  it('accepts only FpLocale members as locale', () => {
    expectTypeOf<FpBaseOptions['locale']>().toEqualTypeOf<FpLocale | undefined>();
    expectTypeOf<'uk'>().not.toExtend<FpLocale>();
  });

  it('keeps every option optional', () => {
    expectTypeOf({}).toExtend<FpBaseOptions>();
  });
});
