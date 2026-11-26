import {FpLocale} from './fp-locale';
import {getFormPulseConfig, resetFormPulseConfig, setFormPulseConfig} from './form-pulse-registry';

describe('form pulse registry', () => {
  afterEach(() => {
    resetFormPulseConfig();
  });

  it('starts with an empty configuration', () => {
    expect(getFormPulseConfig()).toEqual({});
  });

  it('stores the configuration', () => {
    const formPulseConfig = {locale: FpLocale.De};
    setFormPulseConfig(formPulseConfig);
    expect(getFormPulseConfig()).toBe(formPulseConfig);
  });

  it('resets to the empty configuration', () => {
    setFormPulseConfig({locale: FpLocale.De});
    resetFormPulseConfig();
    expect(getFormPulseConfig()).toEqual({});
  });
});
