import type {ApiRow} from '../../validator-page/api-table';
import type {ReferenceColumn, ReferenceRow} from '../../validator-page/reference-table';

export const REQUIRED_IMPORT_REACTIVE = [
  'import {FormControl} from \'@angular/forms\';',
  'import {fpRequired} from \'ngx-formpulse\';',
  '',
  'const name = new FormControl(\'\', [fpRequired()]);'
].join('\n');

export const REQUIRED_IMPORT_SIGNALS = [
  'import {form} from \'@angular/forms/signals\';',
  'import {fpRequired} from \'ngx-formpulse/signals\';',
  '',
  'const orderForm = form(model, (path) => {',
  '  fpRequired(path.name);',
  '});'
].join('\n');

export const REQUIRED_ERROR_EXAMPLE = [
  'control.errors?.fpRequired',
  '',
  '{',
  '  message: \'This field is required.\'',
  '}'
].join('\n');

export const REQUIRED_MARKER_EXAMPLE = [
  '<mat-form-field>',
  '  <mat-label>Name <span aria-hidden="true">*</span></mat-label>',
  '  <input matInput [formControl]="name">',
  '</mat-form-field>',
  '',
  '<label for="quantity">Quantity <span aria-hidden="true">*</span></label>',
  '<input id="quantity" type="number" aria-required="true" [formControl]="quantity">'
].join('\n');

export const REQUIRED_REACTIVE_SIGNATURE = 'fpRequired(validator_options?: FpRequiredOptions): ValidatorFn';

export const REQUIRED_SIGNAL_SIGNATURE = [
  'fpRequired<TValue>(',
  '  schema_path: SchemaPath<TValue>,',
  '  validator_options?: FpRequiredOptions | (() => FpRequiredOptions)',
  '): void'
].join('\n');

export const REQUIRED_PARAMETER_ROWS: readonly ApiRow[] = [
  {name: 'schema_path', type: 'SchemaPath<TValue>', required: 'Signal Forms only', defaultValue: '—', description: 'Field of any value type to require.'},
  {name: 'validator_options', type: 'FpRequiredOptions', required: 'No', defaultValue: '{}', description: 'Locale and custom message. In Signal Forms it can also be a function returning them, read on every validation.'}
];

export const REQUIRED_OPTION_ROWS: readonly ApiRow[] = [
  {name: 'locale', type: 'FpLocale', required: 'No', defaultValue: 'global locale', description: 'Message language for this validator only.'},
  {name: 'message', type: 'FpMessage<FpRequiredError>', required: 'No', defaultValue: 'built-in', description: 'Custom message: text or a function.'}
];

export const REQUIRED_ERROR_ROWS: readonly ApiRow[] = [
  {name: 'message', type: 'string', required: 'Always', defaultValue: '—', description: 'Resolved, localized message.'}
];

export const REQUIRED_IMPORT_ROWS: readonly ApiRow[] = [
  {name: 'fpRequired', type: 'ngx-formpulse', required: 'Reactive Forms', defaultValue: '—', description: 'Validator factory returning a ValidatorFn.'},
  {name: 'fpRequired', type: 'ngx-formpulse/signals', required: 'Signal Forms', defaultValue: '—', description: 'Schema rule: validates the field and marks it as required.'},
  {name: 'FpRequiredOptions', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'Options type.'},
  {name: 'FpRequiredError', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'Error type.'},
  {name: 'FpLocale', type: 'ngx-formpulse', required: 'Optional', defaultValue: '—', description: 'Message languages.'},
  {name: 'provideFormPulse', type: 'ngx-formpulse', required: 'Optional', defaultValue: '—', description: 'Application-wide locale, locale packs and message overrides.'}
];

export const REQUIRED_RULES = [
  'Missing: null, undefined, an empty string and a string of spaces only (spaces, non-breaking spaces, tabs, line breaks).',
  'Numbers: every number is filled, including 0, -0 and Infinity; NaN is missing.',
  'Booleans: true and false are filled, so a "yes / no" question can be required. An untouched checkbox (null) is missing.',
  'Collections: an empty array, Set, Map or FileList is missing; one with at least one item is filled.',
  'Dates: an invalid Date is missing; a valid Date is filled.',
  'Any other value is filled, including {} and 0n: only your code knows whether an object is "empty".',
  'The control value is never modified; there is no strict option.',
  'Signal Forms: fpRequired also marks the field as required, so field().required() is true and the input gets the required attribute.',
  'Reactive Forms: Angular shows the required marker only for its own Validators.required, so add a visual asterisk yourself and, on a plain input, aria-required.'
];

export const REQUIRED_MESSAGE_FORMS = [
  'import {fpRequired} from \'ngx-formpulse\';',
  '',
  'fpRequired({message: \'Enter your name.\'});',
  'fpRequired({message: () => \'Choose at least one language.\'});'
].join('\n');

export const COMPARISON_COLUMNS: readonly ReferenceColumn[] = [
  {key: 'value', header: 'Value', isCode: true},
  {key: 'angular', header: 'Angular', isCode: false},
  {key: 'html', header: 'HTML5 required', isCode: false},
  {key: 'reactHookForm', header: 'React Hook Form', isCode: false},
  {key: 'veeValidate', header: 'VeeValidate', isCode: false},
  {key: 'vuelidate', header: 'Vuelidate', isCode: false},
  {key: 'laravel', header: 'Laravel', isCode: false},
  {key: 'formPulse', header: 'fpRequired', isCode: false}
];

const MISSING = 'missing';
const FILLED = 'filled';
const NOT_HANDLED = '—';

export const COMPARISON_ROWS: readonly ReferenceRow[] = [
  {value: 'null, undefined', angular: MISSING, html: MISSING, reactHookForm: MISSING, veeValidate: MISSING, vuelidate: MISSING, laravel: MISSING, formPulse: MISSING},
  {value: '\'\'', angular: MISSING, html: MISSING, reactHookForm: MISSING, veeValidate: MISSING, vuelidate: MISSING, laravel: MISSING, formPulse: MISSING},
  {value: '\'   \'', angular: FILLED, html: FILLED, reactHookForm: FILLED, veeValidate: MISSING, vuelidate: FILLED, laravel: MISSING, formPulse: MISSING},
  {value: '0', angular: FILLED, html: FILLED, reactHookForm: FILLED, veeValidate: FILLED, vuelidate: FILLED, laravel: FILLED, formPulse: FILLED},
  {value: 'false', angular: FILLED, html: MISSING, reactHookForm: MISSING, veeValidate: MISSING, vuelidate: FILLED, laravel: FILLED, formPulse: FILLED},
  {value: '[]', angular: MISSING, html: NOT_HANDLED, reactHookForm: MISSING, veeValidate: MISSING, vuelidate: MISSING, laravel: MISSING, formPulse: MISSING},
  {value: 'empty Set / Map', angular: 'missing / filled', html: NOT_HANDLED, reactHookForm: FILLED, veeValidate: FILLED, vuelidate: FILLED, laravel: MISSING, formPulse: MISSING},
  {value: 'empty FileList', angular: FILLED, html: MISSING, reactHookForm: MISSING, veeValidate: FILLED, vuelidate: FILLED, laravel: MISSING, formPulse: MISSING},
  {value: 'invalid Date', angular: FILLED, html: NOT_HANDLED, reactHookForm: FILLED, veeValidate: FILLED, vuelidate: MISSING, laravel: FILLED, formPulse: MISSING},
  {value: 'NaN', angular: FILLED, html: MISSING, reactHookForm: FILLED, veeValidate: FILLED, vuelidate: FILLED, laravel: FILLED, formPulse: MISSING},
  {value: '{}', angular: FILLED, html: NOT_HANDLED, reactHookForm: FILLED, veeValidate: FILLED, vuelidate: MISSING, laravel: FILLED, formPulse: FILLED}
];
