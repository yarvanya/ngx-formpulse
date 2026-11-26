import type {ApiRow} from '../../validator-page/api-table';

export const POST_CODE_IMPORT_REACTIVE = [
  'import {FormControl} from \'@angular/forms\';',
  'import {FpCountry, fpPostCode} from \'ngx-formpulse\';',
  '',
  'const postCode = new FormControl(\'\', [fpPostCode(FpCountry.UA)]);'
].join('\n');

export const POST_CODE_IMPORT_SIGNALS = [
  'import {form} from \'@angular/forms/signals\';',
  'import {FpCountry} from \'ngx-formpulse\';',
  'import {fpPostCode} from \'ngx-formpulse/signals\';',
  '',
  'const addressForm = form(model, (path) => {',
  '  fpPostCode(path.postCode, FpCountry.UA);',
  '});'
].join('\n');

export const POST_CODE_ERROR_EXAMPLE = [
  'control.errors?.fpPostCode',
  '',
  '{',
  '  country: FpCountry.UA,',
  '  examples: [\'15432\', \'01055\', \'01001\'],',
  '  message: \'Enter a valid postal code, e.g. 15432.\'',
  '}'
].join('\n');

export const POST_CODE_REACTIVE_SIGNATURES = [
  'fpPostCode(validator_options?: FpPostCodeOptions): ValidatorFn',
  'fpPostCode(country: FpCountry | null, validator_options?: FpPostCodeOptions): ValidatorFn'
].join('\n');

export const POST_CODE_SIGNAL_SIGNATURES = [
  'fpPostCode(schema_path: SchemaPath<string | null | undefined>, validator_options?: FpPostCodeOptions | (() => FpPostCodeOptions)): void',
  'fpPostCode(',
  '  schema_path: SchemaPath<string | null | undefined>,',
  '  country: FpCountry | null | (() => FpCountry | null),',
  '  validator_options?: FpPostCodeOptions | (() => FpPostCodeOptions)',
  '): void'
].join('\n');

export const POST_CODE_PARAMETER_ROWS: readonly ApiRow[] = [
  {name: 'schema_path', type: 'SchemaPath', required: 'Signal Forms only', defaultValue: '—', description: 'Field to validate.'},
  {name: 'country', type: 'FpCountry | null', required: 'No', defaultValue: 'any country', description: 'Country whose format the value must match; null or no country means any supported country. In Signal Forms it can also be a function such as () => model().country, read on every validation.'},
  {name: 'validator_options', type: 'FpPostCodeOptions', required: 'No', defaultValue: '{}', description: 'Locale, custom message and strict matching. In Signal Forms it can also be a function returning them.'}
];

export const POST_CODE_OPTION_ROWS: readonly ApiRow[] = [
  {name: 'locale', type: 'FpLocale', required: 'No', defaultValue: 'global locale', description: 'Message language for this validator only.'},
  {name: 'message', type: 'FpMessage<FpPostCodeError>', required: 'No', defaultValue: 'built-in', description: 'Custom message: text, a {parameterName} template or a function of the error.'},
  {name: 'strict', type: 'boolean', required: 'No', defaultValue: 'false', description: 'Match exactly as entered; by default surrounding spaces and letter case are ignored.'}
];

export const POST_CODE_ERROR_ROWS: readonly ApiRow[] = [
  {name: 'country', type: 'FpCountry | null', required: 'Always', defaultValue: '—', description: 'Country the value was checked against; null in any-country mode.'},
  {name: 'examples', type: 'readonly string[]', required: 'Always', defaultValue: '—', description: 'Example postal codes of that country; empty in any-country mode.'},
  {name: 'message', type: 'string', required: 'Always', defaultValue: '—', description: 'Resolved, localized message.'}
];

export const POST_CODE_IMPORT_ROWS: readonly ApiRow[] = [
  {name: 'fpPostCode', type: 'ngx-formpulse', required: 'Reactive Forms', defaultValue: '—', description: 'Validator factory returning a ValidatorFn.'},
  {name: 'fpPostCode', type: 'ngx-formpulse/signals', required: 'Signal Forms', defaultValue: '—', description: 'Schema rule applied with validate() inside form().'},
  {name: 'FpCountry', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'ISO 3166-1 alpha-2 country codes.'},
  {name: 'FpLocale', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'Message languages.'},
  {name: 'FpPostCodeOptions', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'Options type.'},
  {name: 'FpPostCodeError', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'Error type.'},
  {name: 'provideFormPulse', type: 'ngx-formpulse', required: 'Optional', defaultValue: '—', description: 'Application-wide locale, locale packs and message overrides.'},
  {name: 'fpLocaleUk … fpLocaleFr', type: 'ngx-formpulse/locales/<code>', required: 'Optional', defaultValue: '—', description: 'Locale packs; only imported packs reach the bundle.'}
];

export const POST_CODE_BEHAVIOUR = [
  'Empty values (\'\', null, undefined) are valid.',
  'A string that is blank after trimming (spaces, non-breaking spaces) is invalid for every country and in any-country mode.',
  'A value that is not a string is invalid.',
  'Tolerant by default: surrounding spaces are trimmed and ASCII letters are upper-cased before matching; strict: true matches exactly as entered.',
  'With a country, the value must match that country\'s pattern; a country without postal codes accepts any other value.',
  'Without a country (or with null), the value must match the pattern of at least one of the 174 supported countries.',
  'In Signal Forms the country and the options can be functions, read on every validation, so the rule follows another field of the form.',
  'The control value is never modified, and the validator never throws.'
];

export const POST_CODE_MESSAGE_PRIORITY = [
  'Inline message: fpPostCode(country, {message}).',
  'Application-wide override: provideFormPulse({messages: {fpPostCode}}).',
  'Locale pack of the effective locale (inline locale, else the default locale).',
  'Built-in English message.'
];

export const POST_CODE_MESSAGE_FORMS = [
  'import {FpCountry, type FpPostCodeError, fpPostCode} from \'ngx-formpulse\';',
  '',
  'fpPostCode(FpCountry.UA, {message: \'Check the postal code.\'});',
  'fpPostCode(FpCountry.UA, {message: \'Expected something like {examples}.\'});',
  'fpPostCode(FpCountry.UA, {',
  '  message: (error_parameters) => `Use ${error_parameters.examples[0] ?? \'a valid code\'} format.`',
  '});'
].join('\n');

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
  '      messages: {fpPostCode: \'Перевірте поштовий індекс.\'}',
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
  {name: 'FpValidatorKey', type: '\'fpPostCode\'', required: 'Type', defaultValue: '—', description: 'Keys of every FormPulse validator.'},
  {name: 'FpErrorMap', type: '{fpPostCode: FpPostCodeError}', required: 'Type', defaultValue: '—', description: 'Validator key to error type.'}
];
