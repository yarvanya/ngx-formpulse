import {EnvironmentInjector} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FpLocale} from './core/fp-locale';
import {getFormPulseConfig, resetFormPulseConfig} from './core/form-pulse-registry';
import {provideFormPulse} from './provide-form-pulse';

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
});
