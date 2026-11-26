import {EnvironmentInjector, type EnvironmentProviders} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import type {FpFormPulseConfig} from '../lib/core/fp-form-pulse-config';
import {FpLocale} from '../lib/core/fp-locale';
import {getFormPulseConfig, resetFormPulseConfig} from '../lib/core/form-pulse-registry';
import {provideFormPulse} from '../lib/provide-form-pulse';

describe('provideFormPulse', () => {
  afterEach(() => {
    resetFormPulseConfig();
  });

  it('registers the configuration when the environment is created', () => {
    const formPulseConfig = {locale: FpLocale.Uk};
    TestBed.configureTestingModule({providers: [provideFormPulse(formPulseConfig)]});
    TestBed.inject(EnvironmentInjector);
    expect(getFormPulseConfig()).toBe(formPulseConfig);
  });

  it('registers an empty configuration by default', () => {
    TestBed.configureTestingModule({providers: [provideFormPulse()]});
    TestBed.inject(EnvironmentInjector);
    expect(getFormPulseConfig()).toEqual({});
  });

  it('takes an optional configuration and returns environment providers', () => {
    expectTypeOf(provideFormPulse).parameter(0).toEqualTypeOf<FpFormPulseConfig | undefined>();
    expectTypeOf(provideFormPulse).toBeCallableWith();
    expectTypeOf(provideFormPulse).returns.toEqualTypeOf<EnvironmentProviders>();
  });
});
