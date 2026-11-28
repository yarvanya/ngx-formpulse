import type {ApiRow} from './api-table';

export const MESSAGE_PRIORITY = [
  'Inline message: the message option of the validator.',
  'Application-wide override: provideFormPulse({messages}).',
  'Locale pack of the effective locale (inline locale, else the default locale).',
  'Built-in English message.'
];

export const PROVIDE_FORM_PULSE_SIGNATURE = 'provideFormPulse(form_pulse_config?: FpFormPulseConfig): EnvironmentProviders';

export const PROVIDE_FORM_PULSE_EXAMPLE = [
  'import {ApplicationConfig} from \'@angular/core\';',
  'import {FpLocale, provideFormPulse} from \'ngx-formpulse\';',
  'import {fpLocaleDe} from \'ngx-formpulse/locales/de\';',
  'import {fpLocaleUk} from \'ngx-formpulse/locales/uk\';',
  '',
  'export const appConfig: ApplicationConfig = {',
  '  providers: [',
  '    provideFormPulse({',
  '      locale: FpLocale.Uk,',
  '      locales: [fpLocaleUk, fpLocaleDe],',
  '      messages: {fpPostCode: \'Check the postal code.\'}',
  '    })',
  '  ]',
  '};'
].join('\n');

export const FORM_PULSE_CONFIG_ROWS: readonly ApiRow[] = [
  {name: 'locale', type: 'FpLocale', required: 'No', defaultValue: 'FpLocale.En', description: 'Default message language. Its pack must be registered in locales (English needs none).'},
  {name: 'locales', type: 'readonly FpLocalePack[]', required: 'No', defaultValue: '[]', description: 'Locale packs to make available. Registering a pack never changes the default.'},
  {name: 'messages', type: 'FpMessageOverrides', required: 'No', defaultValue: '{}', description: 'Application-wide message per validator key, e.g. {fpPostCode: \'…\'}.'}
];

export const RELATED_TYPE_ROWS: readonly ApiRow[] = [
  {name: 'FpError<TParameters>', type: 'Readonly<TParameters> & {message: string}', required: 'Type', defaultValue: '—', description: 'Shape of every FormPulse error.'},
  {name: 'FpErrorParameters<TError>', type: 'Omit<TError, \'message\'>', required: 'Type', defaultValue: '—', description: 'Error without its message; input of a message function.'},
  {name: 'FpBaseOptions<TError>', type: '{locale?, message?}', required: 'Type', defaultValue: '—', description: 'Options shared by every validator.'},
  {name: 'FpMessage<TError>', type: 'string | ((error_parameters) => string)', required: 'Type', defaultValue: '—', description: 'Custom message: text, {parameterName} template or function.'},
  {name: 'FpLocalePack', type: '{locale: FpLocale; messages: FpLocaleMessages}', required: 'Type', defaultValue: '—', description: 'Messages of one language for every validator.'},
  {name: 'FpLocaleMessages', type: '{[key in FpValidatorKey]: FpMessage}', required: 'Type', defaultValue: '—', description: 'One message per validator key.'},
  {name: 'FpMessageOverrides', type: '{[key in FpValidatorKey]?: FpMessage}', required: 'Type', defaultValue: '—', description: 'Optional application-wide messages.'},
  {name: 'FpValidatorKey', type: '\'fpEmail\' | \'fpPostCode\' | \'fpRequired\'', required: 'Type', defaultValue: '—', description: 'Keys of every FormPulse validator.'},
  {name: 'FpErrorMap', type: '{fpEmail: FpEmailError; fpPostCode: FpPostCodeError; fpRequired: FpRequiredError}', required: 'Type', defaultValue: '—', description: 'Validator key to error type.'}
];
