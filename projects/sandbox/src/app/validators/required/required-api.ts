import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, type ValidationErrors} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {FpLocale, fpRequired} from 'ngx-formpulse';
import {isObject, isString} from '../../utilities/core.utility';
import {ApiTable} from '../../validator-page/api-table';
import {CodeExample} from '../../validator-page/code-example';
import {FORM_PULSE_CONFIG_ROWS, MESSAGE_PRIORITY, PROVIDE_FORM_PULSE_EXAMPLE, PROVIDE_FORM_PULSE_SIGNATURE, RELATED_TYPE_ROWS} from '../../validator-page/form-pulse-documentation';
import {type ReferenceColumn, type ReferenceRow, ReferenceTable} from '../../validator-page/reference-table';
import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  REQUIRED_ERROR_EXAMPLE,
  REQUIRED_ERROR_ROWS,
  REQUIRED_IMPORT_ROWS,
  REQUIRED_MESSAGE_FORMS,
  REQUIRED_OPTION_ROWS,
  REQUIRED_PARAMETER_ROWS,
  REQUIRED_REACTIVE_SIGNATURE,
  REQUIRED_RULES,
  REQUIRED_SIGNAL_SIGNATURE
} from './required-documentation';

const LANGUAGE_NAMES = new Intl.DisplayNames(['en'], {type: 'language'});
const MISSING_VALUE = '';

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

function readRequiredMessage(validation_errors: ValidationErrors | null): string {
  const requiredError: unknown = validation_errors?.['fpRequired'];
  if (!isObject(requiredError) || !('message' in requiredError)) {
    return '';
  }
  return isString(requiredError.message) ? requiredError.message : '';
}

function toMessageRow(locale: FpLocale): ReferenceRow {
  return {
    language: LANGUAGE_NAMES.of(locale) ?? locale,
    message: readRequiredMessage(fpRequired({locale})(new FormControl(MISSING_VALUE)))
  };
}

@Component({
  selector: 'fp-required-api',
  imports: [MatCardModule, ApiTable, CodeExample, ReferenceTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../validator-page/validator-page.scss',
  templateUrl: './required-api.html'
})
export class RequiredApi {
  private readonly hostDocument = inject(DOCUMENT);

  protected readonly contentsLinks = CONTENTS_LINKS;
  protected readonly importRows = REQUIRED_IMPORT_ROWS;
  protected readonly reactiveSignature = REQUIRED_REACTIVE_SIGNATURE;
  protected readonly signalSignature = REQUIRED_SIGNAL_SIGNATURE;
  protected readonly parameterRows = REQUIRED_PARAMETER_ROWS;
  protected readonly optionRows = REQUIRED_OPTION_ROWS;
  protected readonly errorRows = REQUIRED_ERROR_ROWS;
  protected readonly errorExample = REQUIRED_ERROR_EXAMPLE;
  protected readonly rules = REQUIRED_RULES;
  protected readonly comparisonColumns = COMPARISON_COLUMNS;
  protected readonly comparisonRows = COMPARISON_ROWS;
  protected readonly messagePriority = MESSAGE_PRIORITY;
  protected readonly messageForms = REQUIRED_MESSAGE_FORMS;
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
