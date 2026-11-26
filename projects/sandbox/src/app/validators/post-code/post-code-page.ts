import {ChangeDetectionStrategy, Component, computed, effect, inject, Injector, runInInjectionContext, signal, untracked} from '@angular/core';
import {FormControl} from '@angular/forms';
import {form} from '@angular/forms/signals';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {POST_CODE_CASES, type PostCodeCase} from '@formpulse/cases';
import {FpCountry, FpLocale, fpPostCode, type FpPostCodeOptions} from 'ngx-formpulse';
import {fpPostCode as fpSignalPostCode} from 'ngx-formpulse/signals';
import {CasesTable, type ValidatorCaseRow} from '../../validator-page/cases-table';
import {CodeExample} from '../../validator-page/code-example';
import {LocaleSwitcher} from '../../validator-page/locale-switcher';
import {ReactiveLiveField} from '../../validator-page/reactive-live-field';
import {SignalLiveField} from '../../validator-page/signal-live-field';
import {SourceNote} from '../../validator-page/source-note';
import {PostCodeApi} from './post-code-api';
import {POST_CODE_ERROR_EXAMPLE, POST_CODE_IMPORT_REACTIVE, POST_CODE_IMPORT_SIGNALS} from './post-code-documentation';

const ANY_COUNTRY = 'any';
const COUNTRIES_BY_VALUE = new Map<string, FpCountry>(Object.values(FpCountry).map((country) => [country, country]));
const REGION_NAMES = new Intl.DisplayNames(['en'], {type: 'region'});

interface CountryOption {
  readonly value: string;
  readonly name: string;
}

function toCaseRow(post_code_case: PostCodeCase): ValidatorCaseRow {
  const countryLabel = post_code_case.country ?? 'any country';
  return {
    description: post_code_case.description,
    value: JSON.stringify(post_code_case.value),
    options: post_code_case.strict ? `${countryLabel}, strict` : countryLabel,
    isValid: post_code_case.isValid
  };
}

function describeArguments(country: FpCountry | null, validator_options: FpPostCodeOptions, locale: FpLocale): string {
  const optionParts = [
    ...(validator_options.strict === true ? ['strict: true'] : []),
    ...(locale === FpLocale.En ? [] : [`locale: FpLocale.${locale.charAt(0).toUpperCase()}${locale.slice(1)}`])
  ];
  const optionsText = optionParts.length > 0 ? `{${optionParts.join(', ')}}` : '';
  return [country === null ? '' : `FpCountry.${country}`, optionsText].filter((part) => part !== '').join(', ');
}

@Component({
  selector: 'fp-post-code-page',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    CasesTable,
    CodeExample,
    LocaleSwitcher,
    ReactiveLiveField,
    SignalLiveField,
    SourceNote,
    PostCodeApi
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../validator-page/validator-page.scss',
  templateUrl: './post-code-page.html'
})
export class PostCodePage {
  private readonly injector = inject(Injector);

  protected readonly anyCountry = ANY_COUNTRY;
  protected readonly importReactive = POST_CODE_IMPORT_REACTIVE;
  protected readonly importSignals = POST_CODE_IMPORT_SIGNALS;
  protected readonly errorExample = POST_CODE_ERROR_EXAMPLE;

  protected readonly countryOptions: readonly CountryOption[] = Object.values(FpCountry)
    .map((country) => ({value: country, name: `${REGION_NAMES.of(country) ?? country} (${country})`}))
    .sort((first_option, second_option) => first_option.name.localeCompare(second_option.name));

  protected readonly caseRows = POST_CODE_CASES.map((post_code_case) => toCaseRow(post_code_case));

  protected readonly reactiveControl = new FormControl('', {nonNullable: true});
  protected readonly signalModel = signal({postCode: ''});

  protected readonly country = signal<FpCountry | null>(FpCountry.UA);
  protected readonly isStrict = signal(false);
  protected readonly locale = signal<FpLocale>(FpLocale.En);

  protected readonly validatorOptions = computed<FpPostCodeOptions>(() => ({strict: this.isStrict(), locale: this.locale()}));

  protected readonly signalForm = computed(() => {
    const country = this.country();
    const validatorOptions = this.validatorOptions();
    return untracked(() => runInInjectionContext(this.injector, () => form(this.signalModel, (schema_path) => {
      if (country === null) {
        fpSignalPostCode(schema_path.postCode, validatorOptions);
      } else {
        fpSignalPostCode(schema_path.postCode, country, validatorOptions);
      }
    })));
  });

  protected readonly reactiveCode = computed(() => [
    'import {FormControl} from \'@angular/forms\';',
    'import {FpCountry, FpLocale, fpPostCode} from \'ngx-formpulse\';',
    '',
    `const postCode = new FormControl('', [fpPostCode(${describeArguments(this.country(), this.validatorOptions(), this.locale())})]);`
  ].join('\n'));

  protected readonly signalCode = computed(() => {
    const argumentsText = describeArguments(this.country(), this.validatorOptions(), this.locale());
    return [
      'import {form} from \'@angular/forms/signals\';',
      'import {FpCountry, FpLocale} from \'ngx-formpulse\';',
      'import {fpPostCode} from \'ngx-formpulse/signals\';',
      '',
      'const postCodeForm = form(model, (path) => {',
      `  fpPostCode(${argumentsText === '' ? 'path.postCode' : `path.postCode, ${argumentsText}`});`,
      '});'
    ].join('\n');
  });

  constructor() {
    effect(() => {
      const country = this.country();
      const validatorOptions = this.validatorOptions();
      this.reactiveControl.setValidators(country === null ? fpPostCode(validatorOptions) : fpPostCode(country, validatorOptions));
      this.reactiveControl.updateValueAndValidity();
    });
    effect(() => {
      const postCodeField = this.signalForm().postCode;
      if (untracked(() => this.signalModel().postCode) !== '') {
        postCodeField().markAsDirty();
      }
    });
  }

  protected selectCountry(selected_value: string): void {
    this.country.set(COUNTRIES_BY_VALUE.get(selected_value) ?? null);
  }

  protected applyCase(case_index: number): void {
    const postCodeCase = POST_CODE_CASES[case_index];
    if (postCodeCase === undefined) {
      return;
    }
    const caseValue = typeof postCodeCase.value === 'string' ? postCodeCase.value : String(postCodeCase.value ?? '');
    this.country.set(postCodeCase.country);
    this.isStrict.set(postCodeCase.strict);
    this.reactiveControl.setValue(caseValue);
    this.reactiveControl.markAsDirty();
    this.signalModel.set({postCode: caseValue});
    this.signalForm().postCode().markAsDirty();
  }
}
