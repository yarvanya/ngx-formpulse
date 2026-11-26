import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, type ValidationErrors} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {POST_CODE_RULES} from '@formpulse/cases';
import {FpCountry, FpLocale, fpPostCode} from 'ngx-formpulse';
import {ApiTable} from '../../validator-page/api-table';
import {CodeExample} from '../../validator-page/code-example';
import {type ReferenceColumn, type ReferenceRow, ReferenceTable} from '../../validator-page/reference-table';
import {
  FORM_PULSE_CONFIG_ROWS,
  POST_CODE_BEHAVIOUR,
  POST_CODE_ERROR_EXAMPLE,
  POST_CODE_ERROR_ROWS,
  POST_CODE_IMPORT_ROWS,
  POST_CODE_MESSAGE_FORMS,
  POST_CODE_MESSAGE_PRIORITY,
  POST_CODE_OPTION_ROWS,
  POST_CODE_PARAMETER_ROWS,
  POST_CODE_REACTIVE_SIGNATURES,
  POST_CODE_SIGNAL_SIGNATURES,
  PROVIDE_FORM_PULSE_EXAMPLE,
  PROVIDE_FORM_PULSE_SIGNATURE,
  RELATED_TYPE_ROWS
} from './post-code-documentation';

const LANGUAGE_NAMES = new Intl.DisplayNames(['en'], {type: 'language'});
const REGION_NAMES = new Intl.DisplayNames(['en'], {type: 'region'});
const INVALID_UKRAINIAN_POST_CODE = '0100';
const INVALID_ANY_POST_CODE = '%%%';

const LOCALE_COLUMNS: readonly ReferenceColumn[] = [
  {key: 'member', header: 'Member', isCode: true},
  {key: 'value', header: 'Value', isCode: true},
  {key: 'language', header: 'Language', isCode: false},
  {key: 'pack', header: 'Locale pack', isCode: true}
];

const MESSAGE_COLUMNS: readonly ReferenceColumn[] = [
  {key: 'language', header: 'Language', isCode: false},
  {key: 'withExample', header: 'With an example (FpCountry.UA)', isCode: false},
  {key: 'withoutExample', header: 'Without an example (any country)', isCode: false}
];

const CONTENTS_LINKS: readonly {readonly label: string; readonly sectionId: string}[] = [
  {label: 'Imports', sectionId: 'api-imports'},
  {label: 'Signatures', sectionId: 'api-signatures'},
  {label: 'Behaviour', sectionId: 'api-behaviour'},
  {label: 'Messages', sectionId: 'api-messages'},
  {label: 'Configuration', sectionId: 'api-configuration'},
  {label: 'Enums', sectionId: 'api-enums'},
  {label: 'Types', sectionId: 'api-types'}
];

const COUNTRY_COLUMNS: readonly ReferenceColumn[] = [
  {key: 'member', header: 'Member', isCode: true},
  {key: 'country', header: 'Country', isCode: false},
  {key: 'postalCodes', header: 'Postal codes', isCode: false},
  {key: 'examples', header: 'Examples', isCode: true}
];

function toMemberName(locale: FpLocale): string {
  return `${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;
}

function readPostCodeMessage(validation_errors: ValidationErrors | null): string {
  const postCodeError: unknown = validation_errors?.['fpPostCode'];
  if (typeof postCodeError !== 'object' || postCodeError === null || !('message' in postCodeError)) {
    return '';
  }
  return typeof postCodeError.message === 'string' ? postCodeError.message : '';
}

function toLocaleRow(locale: FpLocale): ReferenceRow {
  return {
    member: `FpLocale.${toMemberName(locale)}`,
    value: `'${locale}'`,
    language: LANGUAGE_NAMES.of(locale) ?? locale,
    pack: locale === FpLocale.En ? 'built in' : `fpLocale${toMemberName(locale)} from 'ngx-formpulse/locales/${locale}'`
  };
}

function toMessageRow(locale: FpLocale): ReferenceRow {
  return {
    language: LANGUAGE_NAMES.of(locale) ?? locale,
    withExample: readPostCodeMessage(fpPostCode(FpCountry.UA, {locale})(new FormControl(INVALID_UKRAINIAN_POST_CODE))),
    withoutExample: readPostCodeMessage(fpPostCode({locale})(new FormControl(INVALID_ANY_POST_CODE)))
  };
}

function toCountryRow(country: FpCountry): ReferenceRow {
  const postCodeRule = POST_CODE_RULES[country];
  return {
    member: `FpCountry.${country}`,
    country: REGION_NAMES.of(country) ?? country,
    postalCodes: postCodeRule === undefined ? 'None: any value is accepted' : 'Validated',
    examples: postCodeRule?.examples.join(', ') ?? ''
  };
}

@Component({
  selector: 'fp-post-code-api',
  imports: [MatCardModule, ApiTable, CodeExample, ReferenceTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../validator-page/validator-page.scss',
  templateUrl: './post-code-api.html'
})
export class PostCodeApi {
  private readonly hostDocument = inject(DOCUMENT);

  protected readonly contentsLinks = CONTENTS_LINKS;
  protected readonly importRows = POST_CODE_IMPORT_ROWS;
  protected readonly reactiveSignatures = POST_CODE_REACTIVE_SIGNATURES;
  protected readonly signalSignatures = POST_CODE_SIGNAL_SIGNATURES;
  protected readonly parameterRows = POST_CODE_PARAMETER_ROWS;
  protected readonly optionRows = POST_CODE_OPTION_ROWS;
  protected readonly errorRows = POST_CODE_ERROR_ROWS;
  protected readonly errorExample = POST_CODE_ERROR_EXAMPLE;
  protected readonly behaviour = POST_CODE_BEHAVIOUR;
  protected readonly messagePriority = POST_CODE_MESSAGE_PRIORITY;
  protected readonly messageForms = POST_CODE_MESSAGE_FORMS;
  protected readonly provideSignature = PROVIDE_FORM_PULSE_SIGNATURE;
  protected readonly provideExample = PROVIDE_FORM_PULSE_EXAMPLE;
  protected readonly configRows = FORM_PULSE_CONFIG_ROWS;
  protected readonly relatedTypeRows = RELATED_TYPE_ROWS;

  protected readonly localeColumns = LOCALE_COLUMNS;
  protected readonly localeRows = Object.values(FpLocale).map((locale) => toLocaleRow(locale));
  protected readonly messageColumns = MESSAGE_COLUMNS;
  protected readonly messageRows = Object.values(FpLocale).map((locale) => toMessageRow(locale));
  protected readonly countryColumns = COUNTRY_COLUMNS;
  protected readonly countryRows = Object.values(FpCountry).map((country) => toCountryRow(country));
  protected readonly validatedCountryCount = Object.keys(POST_CODE_RULES).length;

  protected scrollToSection(section_id: string): void {
    this.hostDocument.getElementById(section_id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
