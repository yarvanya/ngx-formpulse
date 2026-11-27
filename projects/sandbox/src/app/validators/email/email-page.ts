import {ChangeDetectionStrategy, Component, computed, effect, signal} from '@angular/core';
import {FormControl} from '@angular/forms';
import {form} from '@angular/forms/signals';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {EMAIL_CASES, type EmailCase} from '@formpulse/cases';
import {fpEmail, type FpEmailOptions, FpLocale} from 'ngx-formpulse';
import {fpEmail as fpSignalEmail} from 'ngx-formpulse/signals';
import {isString} from '../../utilities/core.utility';
import {CasesTable, type ValidatorCaseRow} from '../../validator-page/cases-table';
import {CodeExample} from '../../validator-page/code-example';
import {LocaleSwitcher} from '../../validator-page/locale-switcher';
import {ReactiveLiveField} from '../../validator-page/reactive-live-field';
import {SignalLiveField} from '../../validator-page/signal-live-field';
import {EmailApi} from './email-api';
import {EMAIL_ERROR_EXAMPLE, EMAIL_IMPORT_REACTIVE, EMAIL_IMPORT_SIGNALS, EMAIL_STANDARDS} from './email-documentation';

const MAX_SHOWN_VALUE_LENGTH = 40;
const SHOWN_VALUE_PREFIX_LENGTH = 24;

function describeValue(case_value: EmailCase['value']): string {
  if (isString(case_value) && case_value.length > MAX_SHOWN_VALUE_LENGTH) {
    return `"${case_value.slice(0, SHOWN_VALUE_PREFIX_LENGTH)}…" (${String(case_value.length)} characters)`;
  }
  return JSON.stringify(case_value);
}

function toCaseRow(email_case: EmailCase): ValidatorCaseRow {
  return {
    description: email_case.description,
    value: describeValue(email_case.value),
    options: email_case.strict ? 'strict' : '',
    isValid: email_case.isValid
  };
}

function describeOptions(validator_options: FpEmailOptions): string {
  const optionParts = [
    ...(validator_options.strict === true ? ['strict: true'] : []),
    ...(validator_options.locale === undefined || validator_options.locale === FpLocale.En
      ? []
      : [`locale: FpLocale.${validator_options.locale.charAt(0).toUpperCase()}${validator_options.locale.slice(1)}`])
  ];
  return optionParts.length > 0 ? `{${optionParts.join(', ')}}` : '';
}

@Component({
  selector: 'fp-email-page',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTabsModule,
    CasesTable,
    CodeExample,
    LocaleSwitcher,
    ReactiveLiveField,
    SignalLiveField,
    EmailApi
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../validator-page/validator-page.scss',
  templateUrl: './email-page.html'
})
export class EmailPage {
  protected readonly importReactive = EMAIL_IMPORT_REACTIVE;
  protected readonly importSignals = EMAIL_IMPORT_SIGNALS;
  protected readonly errorExample = EMAIL_ERROR_EXAMPLE;
  protected readonly standards = EMAIL_STANDARDS;
  protected readonly caseRows = EMAIL_CASES.map((email_case) => toCaseRow(email_case));

  protected readonly reactiveControl = new FormControl('', {nonNullable: true});
  protected readonly signalModel = signal({email: ''});

  protected readonly isStrict = signal(false);
  protected readonly locale = signal<FpLocale>(FpLocale.En);

  protected readonly validatorOptions = computed<FpEmailOptions>(() => ({strict: this.isStrict(), locale: this.locale()}));

  protected readonly signalForm = form(this.signalModel, (schema_path) => {
    fpSignalEmail(schema_path.email, () => this.validatorOptions());
  });

  protected readonly reactiveCode = computed(() => [
    'import {FormControl} from \'@angular/forms\';',
    'import {FpLocale, fpEmail} from \'ngx-formpulse\';',
    '',
    `const email = new FormControl('', [fpEmail(${describeOptions(this.validatorOptions())})]);`
  ].join('\n'));

  protected readonly signalCode = computed(() => {
    const optionsText = describeOptions(this.validatorOptions());
    return [
      'import {form} from \'@angular/forms/signals\';',
      'import {FpLocale} from \'ngx-formpulse\';',
      'import {fpEmail} from \'ngx-formpulse/signals\';',
      '',
      'const signUpForm = form(model, (path) => {',
      `  fpEmail(${optionsText === '' ? 'path.email' : `path.email, ${optionsText}`});`,
      '});'
    ].join('\n');
  });

  constructor() {
    effect(() => {
      this.reactiveControl.setValidators(fpEmail(this.validatorOptions()));
      this.reactiveControl.updateValueAndValidity();
    });
  }

  protected applyCase(case_index: number): void {
    const emailCase = EMAIL_CASES[case_index];
    if (emailCase === undefined) {
      return;
    }
    const caseValue = isString(emailCase.value) ? emailCase.value : String(emailCase.value ?? '');
    this.isStrict.set(emailCase.strict);
    this.reactiveControl.setValue(caseValue);
    this.reactiveControl.markAsDirty();
    this.signalModel.set({email: caseValue});
    this.signalForm.email().markAsDirty();
  }
}
