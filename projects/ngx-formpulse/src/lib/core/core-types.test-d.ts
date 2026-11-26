import type {EnvironmentProviders} from '@angular/core';
import {
  type FpBaseOptions,
  type FpError,
  type FpErrorParameters,
  type FpFormPulseConfig,
  FpLocale,
  type FpLocaleMessages,
  type FpLocalePack,
  type FpMessage,
  type FpValidatorKey,
  provideFormPulse
} from 'ngx-formpulse';
import {fpLocaleUk} from 'ngx-formpulse/locales/uk';

type PostCodeError = FpError<{country: string; expectedFormat: string}>;

describe('FpError', () => {
  it('always carries a readonly message', () => {
    expectTypeOf<FpError>().toEqualTypeOf<Readonly<object> & {readonly message: string}>();
    expectTypeOf<PostCodeError['message']>().toEqualTypeOf<string>();
  });

  it('keeps validator-specific parameters', () => {
    expectTypeOf<PostCodeError>().toHaveProperty('expectedFormat').toEqualTypeOf<string>();
  });

  it('removes the message from the error parameters', () => {
    expectTypeOf<FpErrorParameters<PostCodeError>>().toEqualTypeOf<Omit<PostCodeError, 'message'>>();
    expectTypeOf<FpErrorParameters<PostCodeError>>().not.toHaveProperty('message');
  });
});

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

describe('FpBaseOptions', () => {
  it('accepts only FpLocale members as locale', () => {
    expectTypeOf<FpBaseOptions['locale']>().toEqualTypeOf<FpLocale | undefined>();
    expectTypeOf<'uk'>().not.toExtend<FpLocale>();
  });
});

describe('FpLocalePack', () => {
  it('has no validator keys before the first validator ships', () => {
    expectTypeOf<FpValidatorKey>().toBeNever();
    expectTypeOf<FpLocaleMessages>().toEqualTypeOf<Readonly<Record<never, string>>>();
  });

  it('is satisfied by the shipped packs', () => {
    expectTypeOf(fpLocaleUk).toExtend<FpLocalePack>();
    expectTypeOf(fpLocaleUk.locale).toEqualTypeOf<FpLocale.Uk>();
  });
});

describe('provideFormPulse', () => {
  it('takes an optional configuration and returns environment providers', () => {
    expectTypeOf(provideFormPulse).parameter(0).toEqualTypeOf<FpFormPulseConfig | undefined>();
    expectTypeOf(provideFormPulse).toBeCallableWith();
    expectTypeOf(provideFormPulse).returns.toEqualTypeOf<EnvironmentProviders>();
  });

  it('accepts a default locale and locale packs', () => {
    expectTypeOf({locale: FpLocale.Uk, locales: [fpLocaleUk]}).toExtend<FpFormPulseConfig>();
  });
});
