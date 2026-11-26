import {FpLocale, type FpLocalePack} from 'ngx-formpulse';
import {fpLocaleDe} from 'ngx-formpulse/locales/de';
import {fpLocaleEs} from 'ngx-formpulse/locales/es';
import {fpLocaleFr} from 'ngx-formpulse/locales/fr';
import {fpLocalePl} from 'ngx-formpulse/locales/pl';
import {fpLocalePt} from 'ngx-formpulse/locales/pt';
import {fpLocaleUk} from 'ngx-formpulse/locales/uk';

const LOCALE_PACKS: readonly {readonly expectedLocale: FpLocale; readonly localePack: FpLocalePack}[] = [
  {expectedLocale: FpLocale.Uk, localePack: fpLocaleUk},
  {expectedLocale: FpLocale.Es, localePack: fpLocaleEs},
  {expectedLocale: FpLocale.Pt, localePack: fpLocalePt},
  {expectedLocale: FpLocale.Pl, localePack: fpLocalePl},
  {expectedLocale: FpLocale.De, localePack: fpLocaleDe},
  {expectedLocale: FpLocale.Fr, localePack: fpLocaleFr}
];

describe('locale packs', () => {
  it.each(LOCALE_PACKS)('pack for $expectedLocale declares its locale', ({expectedLocale, localePack}) => {
    expect(localePack.locale).toBe(expectedLocale);
  });

  it.each(LOCALE_PACKS)('pack for $expectedLocale has no messages before the first validator ships', ({localePack}) => {
    expect(Object.keys(localePack.messages)).toEqual([]);
  });
});
