import {resetDevelopmentWarnings} from '../../lib/core/development-warning';
import {FpLocale} from '../../lib/core/fp-locale';
import type {FpLocalePack} from '../../lib/core/fp-locale-pack';
import {resetFormPulseConfig, setFormPulseConfig} from '../../lib/core/form-pulse-registry';
import {type MessageRequest, resolveMessage} from '../../lib/core/message-resolver';

const VALIDATOR_KEY = 'fpPostCode';
const UNKNOWN_VALIDATOR_KEY = 'fpUnknown';
const ENGLISH_MESSAGE = 'Expected {expectedFormat} for {country}.';
const ENGLISH_RESULT = 'Expected NNNNN for UA.';
const ERROR_PARAMETERS = {country: 'UA', expectedFormat: 'NNNNN'};
const UKRAINIAN_RESULT = 'Очікується NNNNN.';
const UKRAINIAN_PACK: FpLocalePack = {locale: FpLocale.Uk, messages: {fpPostCode: 'Очікується {expectedFormat}.'}};
const GERMAN_PACK: FpLocalePack = {locale: FpLocale.De, messages: {fpPostCode: 'Erwartet {expectedFormat}.'}};
const GLOBAL_MESSAGES = {fpPostCode: 'Global {country}.'};
const GLOBAL_RESULT = 'Global UA.';
const INLINE_MESSAGE = 'Inline {expectedFormat}.';
const INLINE_RESULT = 'Inline NNNNN.';
const FIRST_NUMBER = 1;
const SECOND_NUMBER = 2;

function createRequest(request_overrides: Partial<MessageRequest> = {}): MessageRequest {
  return {
    validatorKey: VALIDATOR_KEY,
    englishMessage: ENGLISH_MESSAGE,
    errorParameters: ERROR_PARAMETERS,
    ...request_overrides
  };
}

describe('resolveMessage', () => {
  afterEach(() => {
    resetFormPulseConfig();
    resetDevelopmentWarnings();
    vi.restoreAllMocks();
  });

  it('returns the English message without configuration', () => {
    expect(resolveMessage(createRequest())).toBe(ENGLISH_RESULT);
  });

  it('returns the locale pack message for the default locale', () => {
    setFormPulseConfig({locale: FpLocale.Uk, locales: [UKRAINIAN_PACK]});
    expect(resolveMessage(createRequest())).toBe(UKRAINIAN_RESULT);
  });

  it('returns English when the pack has no message for the validator', () => {
    setFormPulseConfig({locale: FpLocale.De, locales: [GERMAN_PACK]});
    expect(resolveMessage(createRequest({validatorKey: UNKNOWN_VALIDATOR_KEY}))).toBe(ENGLISH_RESULT);
  });

  it('returns English for an inline English locale', () => {
    setFormPulseConfig({locale: FpLocale.Uk, locales: [UKRAINIAN_PACK]});
    expect(resolveMessage(createRequest({inlineLocale: FpLocale.En}))).toBe(ENGLISH_RESULT);
  });

  it('prefers a global override over the locale pack', () => {
    setFormPulseConfig({locale: FpLocale.Uk, locales: [UKRAINIAN_PACK], messages: GLOBAL_MESSAGES});
    expect(resolveMessage(createRequest())).toBe(GLOBAL_RESULT);
  });

  it('prefers an inline message over a global override', () => {
    setFormPulseConfig({messages: GLOBAL_MESSAGES});
    expect(resolveMessage(createRequest({inlineMessage: INLINE_MESSAGE}))).toBe(INLINE_RESULT);
  });

  it('calls an English message function with the error parameters', () => {
    expect(resolveMessage(createRequest({englishMessage: () => 'Computed {country}.'}))).toBe('Computed UA.');
  });

  it('calls a message function with the error parameters', () => {
    const messageFunction = vi.fn((error_parameters: object) => `Function ${JSON.stringify(error_parameters)}`);
    expect(resolveMessage(createRequest({inlineMessage: messageFunction}))).toBe(`Function ${JSON.stringify(ERROR_PARAMETERS)}`);
    expect(messageFunction).toHaveBeenCalledExactlyOnceWith(ERROR_PARAMETERS);
  });

  it('keeps unknown placeholders unchanged', () => {
    expect(resolveMessage(createRequest({englishMessage: 'Value {missing}.'}))).toBe('Value {missing}.');
  });

  it('formats numbers, null, lists and objects', () => {
    const request = createRequest({
      englishMessage: '{amount} {nothing} {items} {details}',
      errorParameters: {amount: FIRST_NUMBER, nothing: null, items: [FIRST_NUMBER, [SECOND_NUMBER]], details: {limit: SECOND_NUMBER}}
    });
    expect(resolveMessage(request)).toBe('1 null 1, 2 {"limit":2}');
  });
});
