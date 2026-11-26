import {resetDevelopmentWarnings, warnOnceInDevelopment} from '../../lib/core/development-warning';

const WARNING_MESSAGE = 'Something is misconfigured.';
const OTHER_WARNING_MESSAGE = 'Something else is misconfigured.';
const PREFIXED_WARNING_MESSAGE = '[FormPulse] Something is misconfigured.';
const SINGLE_CALL = 1;
const TWO_CALLS = 2;

describe('warnOnceInDevelopment', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    resetDevelopmentWarnings();
  });

  it('warns with the FormPulse prefix when the development flag is not defined', () => {
    vi.stubGlobal('ngDevMode', undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnOnceInDevelopment(WARNING_MESSAGE);
    expect(warnSpy).toHaveBeenCalledExactlyOnceWith(PREFIXED_WARNING_MESSAGE);
  });

  it('warns when the development flag is enabled', () => {
    vi.stubGlobal('ngDevMode', {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnOnceInDevelopment(WARNING_MESSAGE);
    expect(warnSpy).toHaveBeenCalledTimes(SINGLE_CALL);
  });

  it('reports the same warning only once', () => {
    vi.stubGlobal('ngDevMode', {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnOnceInDevelopment(WARNING_MESSAGE);
    warnOnceInDevelopment(WARNING_MESSAGE);
    warnOnceInDevelopment(OTHER_WARNING_MESSAGE);
    expect(warnSpy).toHaveBeenCalledTimes(TWO_CALLS);
  });

  it('stays silent in production mode', () => {
    vi.stubGlobal('ngDevMode', false);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnOnceInDevelopment(WARNING_MESSAGE);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
