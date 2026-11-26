import type {FpLocale} from '../../lib/core/fp-locale';
import type {FpLocaleMessages, FpLocalePack} from '../../lib/core/fp-locale-pack';

describe('FpLocalePack', () => {
  it('has no messages before the first validator ships', () => {
    expectTypeOf<FpLocaleMessages>().toEqualTypeOf<Readonly<Record<never, string>>>();
  });

  it('pairs a locale with its messages', () => {
    expectTypeOf<FpLocalePack['locale']>().toEqualTypeOf<FpLocale>();
    expectTypeOf<FpLocalePack['messages']>().toEqualTypeOf<FpLocaleMessages>();
  });
});
