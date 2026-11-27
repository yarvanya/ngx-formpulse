import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, type ValidationErrors} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {FpLocale, fpEmail} from 'ngx-formpulse';
import {isObject, isString} from '../../utilities/core.utility';
import {ApiTable} from '../../validator-page/api-table';
import {CodeExample} from '../../validator-page/code-example';
import {FORM_PULSE_CONFIG_ROWS, MESSAGE_PRIORITY, PROVIDE_FORM_PULSE_EXAMPLE, PROVIDE_FORM_PULSE_SIGNATURE, RELATED_TYPE_ROWS} from '../../validator-page/form-pulse-documentation';
import {type ReferenceColumn, type ReferenceRow, ReferenceTable} from '../../validator-page/reference-table';
import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  EMAIL_ERROR_EXAMPLE,
  EMAIL_ERROR_ROWS,
  EMAIL_IMPORT_ROWS,
  EMAIL_MESSAGE_FORMS,
  EMAIL_OPTION_ROWS,
  EMAIL_PARAMETER_ROWS,
  EMAIL_REACTIVE_SIGNATURE,
  EMAIL_RULES,
  EMAIL_SIGNAL_SIGNATURE
} from './email-documentation';

const LANGUAGE_NAMES = new Intl.DisplayNames(['en'], {type: 'language'});
const INVALID_EMAIL = 'name@company';

const MESSAGE_COLUMNS: readonly ReferenceColumn[] = [
  {key: 'language', header: 'Language', isCode: false},
  {key: 'message', header: 'Message', isCode: false}
];

const CONTENTS_LINKS: readonly {readonly label: string; readonly sectionId: string}[] = [
  {label: 'Imports', sectionId: 'api-imports'},
  {label: 'Signatures', sectionId: 'api-signatures'},
  {label: 'Rules', sectionId: 'api-rules'},
  {label: 'Comparison', sectionId: 'api-comparison'},
  {label: 'Messages', sectionId: 'api-messages'},
  {label: 'Configuration', sectionId: 'api-configuration'},
  {label: 'Types', sectionId: 'api-types'}
];

function readEmailMessage(validation_errors: ValidationErrors | null): string {
  const emailError: unknown = validation_errors?.['fpEmail'];
  if (!isObject(emailError) || !('message' in emailError)) {
    return '';
  }
  return isString(emailError.message) ? emailError.message : '';
}

function toMessageRow(locale: FpLocale): ReferenceRow {
  return {
    language: LANGUAGE_NAMES.of(locale) ?? locale,
    message: readEmailMessage(fpEmail({locale})(new FormControl(INVALID_EMAIL)))
  };
}

@Component({
  selector: 'fp-email-api',
  imports: [MatCardModule, ApiTable, CodeExample, ReferenceTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../validator-page/validator-page.scss',
  templateUrl: './email-api.html'
})
export class EmailApi {
  private readonly hostDocument = inject(DOCUMENT);

  protected readonly contentsLinks = CONTENTS_LINKS;
  protected readonly importRows = EMAIL_IMPORT_ROWS;
  protected readonly reactiveSignature = EMAIL_REACTIVE_SIGNATURE;
  protected readonly signalSignature = EMAIL_SIGNAL_SIGNATURE;
  protected readonly parameterRows = EMAIL_PARAMETER_ROWS;
  protected readonly optionRows = EMAIL_OPTION_ROWS;
  protected readonly errorRows = EMAIL_ERROR_ROWS;
  protected readonly errorExample = EMAIL_ERROR_EXAMPLE;
  protected readonly rules = EMAIL_RULES;
  protected readonly comparisonColumns = COMPARISON_COLUMNS;
  protected readonly comparisonRows = COMPARISON_ROWS;
  protected readonly messagePriority = MESSAGE_PRIORITY;
  protected readonly messageForms = EMAIL_MESSAGE_FORMS;
  protected readonly messageColumns = MESSAGE_COLUMNS;
  protected readonly messageRows = Object.values(FpLocale).map((locale) => toMessageRow(locale));
  protected readonly provideSignature = PROVIDE_FORM_PULSE_SIGNATURE;
  protected readonly provideExample = PROVIDE_FORM_PULSE_EXAMPLE;
  protected readonly configRows = FORM_PULSE_CONFIG_ROWS;
  protected readonly relatedTypeRows = RELATED_TYPE_ROWS;

  protected scrollToSection(section_id: string): void {
    this.hostDocument.getElementById(section_id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
