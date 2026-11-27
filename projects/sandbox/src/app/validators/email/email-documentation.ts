import type {ApiRow} from '../../validator-page/api-table';
import type {ReferenceColumn, ReferenceRow} from '../../validator-page/reference-table';

export const EMAIL_IMPORT_REACTIVE = [
  'import {FormControl} from \'@angular/forms\';',
  'import {fpEmail} from \'ngx-formpulse\';',
  '',
  'const email = new FormControl(\'\', [fpEmail()]);'
].join('\n');

export const EMAIL_IMPORT_SIGNALS = [
  'import {form} from \'@angular/forms/signals\';',
  'import {fpEmail} from \'ngx-formpulse/signals\';',
  '',
  'const signUpForm = form(model, (path) => {',
  '  fpEmail(path.email);',
  '});'
].join('\n');

export const EMAIL_ERROR_EXAMPLE = [
  'control.errors?.fpEmail',
  '',
  '{',
  '  message: \'Enter a valid email address, e.g. name@example.com.\'',
  '}'
].join('\n');

export const EMAIL_REACTIVE_SIGNATURE = 'fpEmail(validator_options?: FpEmailOptions): ValidatorFn';

export const EMAIL_SIGNAL_SIGNATURE = [
  'fpEmail(',
  '  schema_path: SchemaPath<string | null | undefined>,',
  '  validator_options?: FpEmailOptions | (() => FpEmailOptions)',
  '): void'
].join('\n');

export const EMAIL_PARAMETER_ROWS: readonly ApiRow[] = [
  {name: 'schema_path', type: 'SchemaPath', required: 'Signal Forms only', defaultValue: '—', description: 'Field to validate.'},
  {name: 'validator_options', type: 'FpEmailOptions', required: 'No', defaultValue: '{}', description: 'Locale, custom message and strict matching. In Signal Forms it can also be a function returning them, read on every validation.'}
];

export const EMAIL_OPTION_ROWS: readonly ApiRow[] = [
  {name: 'locale', type: 'FpLocale', required: 'No', defaultValue: 'global locale', description: 'Message language for this validator only.'},
  {name: 'message', type: 'FpMessage<FpEmailError>', required: 'No', defaultValue: 'built-in', description: 'Custom message: text or a function.'},
  {name: 'strict', type: 'boolean', required: 'No', defaultValue: 'false', description: 'Check the value exactly as entered; by default surrounding spaces are ignored.'}
];

export const EMAIL_ERROR_ROWS: readonly ApiRow[] = [
  {name: 'message', type: 'string', required: 'Always', defaultValue: '—', description: 'Resolved, localized message.'}
];

export const EMAIL_IMPORT_ROWS: readonly ApiRow[] = [
  {name: 'fpEmail', type: 'ngx-formpulse', required: 'Reactive Forms', defaultValue: '—', description: 'Validator factory returning a ValidatorFn.'},
  {name: 'fpEmail', type: 'ngx-formpulse/signals', required: 'Signal Forms', defaultValue: '—', description: 'Schema rule applied with validate() inside form().'},
  {name: 'FpEmailOptions', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'Options type.'},
  {name: 'FpEmailError', type: 'ngx-formpulse', required: 'Both', defaultValue: '—', description: 'Error type.'},
  {name: 'FpLocale', type: 'ngx-formpulse', required: 'Optional', defaultValue: '—', description: 'Message languages.'},
  {name: 'provideFormPulse', type: 'ngx-formpulse', required: 'Optional', defaultValue: '—', description: 'Application-wide locale, locale packs and message overrides.'}
];

export const EMAIL_RULES = [
  'Empty values (\'\', null, undefined) are valid. A value of spaces only and a value that is not a string are invalid.',
  'Tolerant by default: surrounding spaces are ignored; strict: true checks the value exactly as entered. Letter case never matters.',
  'Exactly one @ splits the address into the part before @ and the domain.',
  'Before @: 1–64 characters of letters, digits and ! # $ % & \' * + - / = ? ^ _ ` { | } ~; dots only between characters (no dot at the start, at the end or twice in a row).',
  'Domain: at least two labels separated by dots; each label has 1–63 letters, digits or hyphens and does not start or end with a hyphen. No underscores.',
  'Top-level domain (the last label) is required: 2–63 letters, or a punycode label such as xn--j1amh, the punycode form of the Ukrainian .ukr domain. A numeric top-level domain is invalid.',
  'The whole address has at most 254 characters.',
  'ASCII only: Cyrillic and other non-ASCII characters are invalid; enter an international domain in punycode.',
  'Not accepted: quoted parts ("ivan petrenko"@example.com), IP addresses instead of a domain, display names (Ivan <ivan@example.com>), a dot at the end of the domain.',
  'Format, not existence: no DNS or mailbox check, no rules of one mail provider, no disposable-address detection.'
];

export const EMAIL_MESSAGE_FORMS = [
  'import {fpEmail} from \'ngx-formpulse\';',
  '',
  'fpEmail({message: \'Check the email address.\'});',
  'fpEmail({message: () => \'Use your work email.\'});'
].join('\n');

export const COMPARISON_COLUMNS: readonly ReferenceColumn[] = [
  {key: 'rule', header: 'Rule', isCode: false},
  {key: 'html', header: 'HTML5 type=email', isCode: false},
  {key: 'angular', header: 'Validators.email', isCode: false},
  {key: 'zod', header: 'Zod', isCode: false},
  {key: 'validatorJs', header: 'validator.js', isCode: false},
  {key: 'formPulse', header: 'fpEmail', isCode: false}
];

export const COMPARISON_ROWS: readonly ReferenceRow[] = [
  {rule: 'Characters before @', html: 'RFC 5322 atext and dots', angular: 'RFC 5322 atext', zod: 'Letters, digits, _ \' + - . only', validatorJs: 'atext, UTF-8 by default', formPulse: 'RFC 5322 atext'},
  {rule: 'Dot at the start, at the end or twice before @', html: 'Accepted', angular: 'Rejected', zod: 'Rejected', validatorJs: 'Rejected', formPulse: 'Rejected'},
  {rule: 'Length limits 64 / 254', html: 'No', angular: 'Yes', zod: 'No', validatorJs: 'Yes', formPulse: 'Yes'},
  {rule: 'Label limit 63, no hyphen at label edges', html: 'Yes', angular: 'Yes', zod: 'No', validatorJs: 'Yes', formPulse: 'Yes'},
  {rule: 'Top-level domain required (user@company)', html: 'No', angular: 'No', zod: 'Yes', validatorJs: 'Yes, by default', formPulse: 'Always'},
  {rule: 'Punycode top-level domain (xn--j1amh)', html: 'Yes', angular: 'Yes', zod: 'No', validatorJs: 'Yes', formPulse: 'Yes'},
  {rule: 'Non-ASCII characters', html: 'No', angular: 'No', zod: 'No', validatorJs: 'Before @ only', formPulse: 'No'},
  {rule: 'Quoted part, IP address, display name', html: 'No', angular: 'No', zod: 'No', validatorJs: 'Through options', formPulse: 'No'}
];

export interface StandardLink {
  readonly name: string;
  readonly url: string;
  readonly topic: string;
}

export const EMAIL_STANDARDS: readonly StandardLink[] = [
  {name: 'WHATWG HTML: valid email address', url: 'https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address', topic: 'base grammar'},
  {name: 'RFC 5322', url: 'https://www.rfc-editor.org/rfc/rfc5322#section-3.2.3', topic: 'characters and dots before @'},
  {name: 'RFC 5321', url: 'https://www.rfc-editor.org/rfc/rfc5321#section-4.5.3.1', topic: 'length of the part before @'},
  {name: 'RFC 3696 erratum 1690', url: 'https://www.rfc-editor.org/errata/eid1690', topic: 'address of 254 characters'},
  {name: 'RFC 1035', url: 'https://www.rfc-editor.org/rfc/rfc1035#section-2.3.1', topic: 'domain labels'},
  {name: 'RFC 5890', url: 'https://www.rfc-editor.org/rfc/rfc5890', topic: 'punycode domains'}
];
