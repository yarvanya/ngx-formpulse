import {resetDevelopmentWarnings} from '../../lib/core/development-warning';
import {FpLocale} from '../../lib/core/fp-locale';
import type {FpLocalePack} from '../../lib/core/fp-locale-pack';
import {findLocalePack, resolveLocale} from '../../lib/core/locale-resolver';

const UKRAINIAN_PACK: FpLocalePack = {locale: FpLocale.Uk, messages: {}};
const GERMAN_PACK: FpLocalePack = {locale: FpLocale.De, messages: {}};

describe('findLocalePack', () => {
  it('finds a registered pack', () => {
    expect(findLocalePack(FpLocale.De, {locales: [UKRAINIAN_PACK, GERMAN_PACK]})).toBe(GERMAN_PACK);
  });

  it('returns undefined when no packs are registered', () => {
    expect(findLocalePack(FpLocale.De, {})).toBeUndefined();
  });
});

describe('resolveLocale', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetDevelopmentWarnings();
  });

  it('uses English without any configuration', () => {
    expect(resolveLocale(undefined, {})).toBe(FpLocale.En);
  });

  it('keeps English as the default when packs are only registered', () => {
    expect(resolveLocale(undefined, {locales: [UKRAINIAN_PACK]})).toBe(FpLocale.En);
  });

  it('uses the configured default locale when its pack is registered', () => {
    expect(resolveLocale(undefined, {locale: FpLocale.Uk, locales: [UKRAINIAN_PACK]})).toBe(FpLocale.Uk);
  });

  it('prefers a registered inline locale over the default', () => {
    expect(resolveLocale(FpLocale.De, {locale: FpLocale.Uk, locales: [UKRAINIAN_PACK, GERMAN_PACK]})).toBe(FpLocale.De);
  });

  it('always allows English inline', () => {
    expect(resolveLocale(FpLocale.En, {locale: FpLocale.Uk, locales: [UKRAINIAN_PACK]})).toBe(FpLocale.En);
  });

  it('falls back to the default and warns when the inline locale has no pack', () => {
    expect(resolveLocale(FpLocale.Fr, {locale: FpLocale.Uk, locales: [UKRAINIAN_PACK]})).toBe(FpLocale.Uk);
    expect(console.warn).toHaveBeenCalledOnce();
  });

  it('falls back to English and warns when the default locale has no pack', () => {
    expect(resolveLocale(undefined, {locale: FpLocale.Pl})).toBe(FpLocale.En);
    expect(console.warn).toHaveBeenCalledOnce();
  });
});
