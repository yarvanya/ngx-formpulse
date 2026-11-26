import type {FpFormPulseConfig} from './fp-form-pulse-config';

const DEFAULT_CONFIG: FpFormPulseConfig = {};

let activeConfig = DEFAULT_CONFIG;

export function setFormPulseConfig(form_pulse_config: FpFormPulseConfig): void {
  activeConfig = form_pulse_config;
}

export function getFormPulseConfig(): FpFormPulseConfig {
  return activeConfig;
}

export function resetFormPulseConfig(): void {
  activeConfig = DEFAULT_CONFIG;
}
