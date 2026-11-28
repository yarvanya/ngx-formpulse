import {ChangeDetectionStrategy, Component, computed, effect, type Signal, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {type AbstractControl, FormControl, ReactiveFormsModule, type ValidationErrors} from '@angular/forms';
import {form, FormField} from '@angular/forms/signals';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {REQUIRED_CASES, type RequiredCase} from '@formpulse/cases';
import {FpLocale, fpRequired, type FpRequiredOptions} from 'ngx-formpulse';
import {fpRequired as fpSignalRequired} from 'ngx-formpulse/signals';
import {map, startWith} from 'rxjs';
import {isBoolean, isNumber, isString} from '../../utilities/core.utility';
import {CasesTable, type ValidatorCaseRow} from '../../validator-page/cases-table';
import {CodeExample} from '../../validator-page/code-example';
import {ErrorView} from '../../validator-page/error-view';
import {FormControlsErrorsResolverPipe} from '../../validator-page/form-controls-errors-resolver-pipe';
import {LocaleSwitcher} from '../../validator-page/locale-switcher';
import {ShowWhileTypingErrorStateMatcher} from '../../validator-page/show-while-typing-error-state-matcher';
import {ValidityIndicator} from '../../validator-page/validity-indicator';
import {RequiredApi} from './required-api';
import {
  REQUIRED_ERROR_EXAMPLE,
  REQUIRED_IMPORT_REACTIVE,
  REQUIRED_IMPORT_SIGNALS,
  REQUIRED_MARKER_EXAMPLE
} from './required-documentation';

interface LanguageOption {
  readonly value: string;
  readonly label: string;
}

interface OrderModel {
  readonly name: string;
  readonly quantity: number | null;
  readonly isAgreed: boolean | null;
  readonly languages: readonly string[];
}

const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {value: 'uk', label: 'Ukrainian'},
  {value: 'en', label: 'English'},
  {value: 'pl', label: 'Polish'},
  {value: 'de', label: 'German'}
];

const EMPTY_ORDER: OrderModel = {name: '', quantity: null, isAgreed: null, languages: []};

function readControlErrors(form_control: AbstractControl): Signal<ValidationErrors | null> {
  return toSignal(form_control.events.pipe(startWith(null), map(() => form_control.errors)), {initialValue: form_control.errors});
}

function toCaseRow(required_case: RequiredCase): ValidatorCaseRow {
  return {
    description: required_case.description,
    value: required_case.valueLabel,
    options: required_case.kind === 'other' ? 'any value' : `${required_case.kind} field`,
    isValid: required_case.isValid
  };
}

function describeOptions(locale: FpLocale): string {
  return locale === FpLocale.En ? '' : `{locale: FpLocale.${locale.charAt(0).toUpperCase()}${locale.slice(1)}}`;
}

function isStringList(case_value: unknown): case_value is readonly string[] {
  return Array.isArray(case_value) && case_value.every((list_item) => isString(list_item));
}

@Component({
  selector: 'fp-required-page',
  imports: [
    ReactiveFormsModule,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    CasesTable,
    CodeExample,
    ErrorView,
    FormControlsErrorsResolverPipe,
    LocaleSwitcher,
    RequiredApi,
    ValidityIndicator
  ],
  providers: [{provide: ErrorStateMatcher, useClass: ShowWhileTypingErrorStateMatcher}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../validator-page/validator-page.scss', './required-page.scss'],
  templateUrl: './required-page.html'
})
export class RequiredPage {
  protected readonly importReactive = REQUIRED_IMPORT_REACTIVE;
  protected readonly importSignals = REQUIRED_IMPORT_SIGNALS;
  protected readonly errorExample = REQUIRED_ERROR_EXAMPLE;
  protected readonly markerExample = REQUIRED_MARKER_EXAMPLE;
  protected readonly languageOptions = LANGUAGE_OPTIONS;
  protected readonly caseRows = REQUIRED_CASES.map((required_case) => toCaseRow(required_case));

  protected readonly locale = signal<FpLocale>(FpLocale.En);
  protected readonly validatorOptions = computed<FpRequiredOptions>(() => ({locale: this.locale()}));

  protected readonly nameControl = new FormControl('', {nonNullable: true});
  protected readonly quantityControl = new FormControl<number | null>(null);
  protected readonly agreementControl = new FormControl<boolean | null>(null);
  protected readonly languagesControl = new FormControl<readonly string[]>([], {nonNullable: true});
  protected readonly anyValueControl = new FormControl<unknown>(null);

  protected readonly nameErrors = readControlErrors(this.nameControl);
  protected readonly quantityErrors = readControlErrors(this.quantityControl);
  protected readonly agreementErrors = readControlErrors(this.agreementControl);
  protected readonly languagesErrors = readControlErrors(this.languagesControl);
  protected readonly anyValueErrors = readControlErrors(this.anyValueControl);

  protected readonly orderModel = signal<OrderModel>(EMPTY_ORDER);
  protected readonly orderForm = form(this.orderModel, (schema_path) => {
    fpSignalRequired(schema_path.name, () => this.validatorOptions());
    fpSignalRequired(schema_path.quantity, () => this.validatorOptions());
    fpSignalRequired(schema_path.isAgreed, () => this.validatorOptions());
    fpSignalRequired(schema_path.languages, () => this.validatorOptions());
  });

  protected readonly anyValueModel = signal<unknown>(null);
  protected readonly anyValueForm = form(this.anyValueModel, (schema_path) => {
    fpSignalRequired(schema_path, () => this.validatorOptions());
  });

  protected readonly appliedValueLabel = signal('null');
  protected readonly anyValueSignalErrors = computed(() => this.anyValueForm().errors().map((signal_error) => ({kind: signal_error.kind, message: signal_error.message})));

  protected readonly reactiveCode = computed(() => {
    const optionsText = describeOptions(this.locale());
    return [
      'import {FormControl, FormGroup} from \'@angular/forms\';',
      'import {FpLocale, fpRequired} from \'ngx-formpulse\';',
      '',
      'const orderForm = new FormGroup({',
      `  name: new FormControl('', [fpRequired(${optionsText})]),`,
      `  quantity: new FormControl<number | null>(null, [fpRequired(${optionsText})]),`,
      `  isAgreed: new FormControl<boolean | null>(null, [fpRequired(${optionsText})]),`,
      `  languages: new FormControl<string[]>([], [fpRequired(${optionsText})])`,
      '});'
    ].join('\n');
  });

  protected readonly signalCode = computed(() => {
    const optionsText = describeOptions(this.locale());
    const argumentsSuffix = optionsText === '' ? '' : `, ${optionsText}`;
    return [
      'import {form} from \'@angular/forms/signals\';',
      'import {FpLocale} from \'ngx-formpulse\';',
      'import {fpRequired} from \'ngx-formpulse/signals\';',
      '',
      'const orderForm = form(orderModel, (path) => {',
      `  fpRequired(path.name${argumentsSuffix});`,
      `  fpRequired(path.quantity${argumentsSuffix});`,
      `  fpRequired(path.isAgreed${argumentsSuffix});`,
      `  fpRequired(path.languages${argumentsSuffix});`,
      '});'
    ].join('\n');
  });

  constructor() {
    effect(() => {
      const requiredValidator = fpRequired(this.validatorOptions());
      for (const formControl of [this.nameControl, this.quantityControl, this.agreementControl, this.languagesControl, this.anyValueControl]) {
        formControl.setValidators(requiredValidator);
        formControl.updateValueAndValidity();
      }
    });
  }

  protected resetCheckboxes(): void {
    this.agreementControl.reset(null);
    this.orderModel.update((order_model) => ({...order_model, isAgreed: null}));
    this.orderForm.isAgreed().reset();
  }

  protected applyCase(case_index: number): void {
    const requiredCase = REQUIRED_CASES[case_index];
    if (requiredCase === undefined) {
      return;
    }
    this.applyToAnyValue(requiredCase);
    this.applyToField(requiredCase);
  }

  private applyToAnyValue(required_case: RequiredCase): void {
    this.anyValueControl.setValue(required_case.value);
    this.anyValueModel.set(required_case.value);
    this.appliedValueLabel.set(required_case.valueLabel);
  }

  private applyToField(required_case: RequiredCase): void {
    const caseValue = required_case.value;
    if (required_case.kind === 'text' && isString(caseValue)) {
      this.nameControl.setValue(caseValue);
      this.nameControl.markAsDirty();
      this.orderModel.update((order_model) => ({...order_model, name: caseValue}));
      this.orderForm.name().markAsDirty();
    } else if (required_case.kind === 'number' && isNumber(caseValue)) {
      this.quantityControl.setValue(caseValue);
      this.quantityControl.markAsDirty();
      this.orderModel.update((order_model) => ({...order_model, quantity: caseValue}));
      this.orderForm.quantity().markAsDirty();
    } else if (required_case.kind === 'boolean' && isBoolean(caseValue)) {
      this.agreementControl.setValue(caseValue);
      this.agreementControl.markAsDirty();
      this.orderModel.update((order_model) => ({...order_model, isAgreed: caseValue}));
      this.orderForm.isAgreed().markAsDirty();
    } else if (required_case.kind === 'list' && isStringList(caseValue)) {
      this.languagesControl.setValue(caseValue);
      this.languagesControl.markAsDirty();
      this.orderModel.update((order_model) => ({...order_model, languages: caseValue}));
      this.orderForm.languages().markAsDirty();
    }
  }
}
