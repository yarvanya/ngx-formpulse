import type {ValidatorNames} from './validator-names';

export interface GeneratedFile {
  readonly path: string;
  readonly content: string;
}

const LIBRARY_ROOT = 'projects/ngx-formpulse';

function joinLines(...file_lines: readonly string[]): string {
  return `${file_lines.join('\n')}\n`;
}

function renderCore(names: ValidatorNames): string {
  return joinLines(
    'import {isBlankText, isEmptyValue} from \'../../core/empty-value\';',
    'import type {FpError} from \'../../core/fp-error\';',
    'import type {FpBaseOptions} from \'../../core/fp-options\';',
    'import {resolveMessage} from \'../../core/message-resolver\';',
    'import {isString} from \'../../utilities/core.utility\';',
    '',
    '/**',
    ` * Error of {@link ${names.validatorKey}}, reported under \`errors.${names.validatorKey}\`.`,
    ' *',
    ' * @example',
    ' * ```ts',
    ` * const validationError: ${names.errorType} | undefined = control.errors?.['${names.validatorKey}'];`,
    ' * ```',
    ' *',
    ` * @see https://github.com/yarvanya/ngx-formpulse#${names.validatorKey.toLowerCase()}`,
    ' */',
    `export type ${names.errorType} = FpError;`,
    '',
    '/**',
    ` * Options of {@link ${names.validatorKey}}.`,
    ' *',
    ' * @example',
    ' * ```ts',
    ` * ${names.validatorKey}({locale: FpLocale.En});`,
    ' * ```',
    ' *',
    ` * @see https://github.com/yarvanya/ngx-formpulse#${names.validatorKey.toLowerCase()}`,
    ' */',
    `export type ${names.optionsType} = FpBaseOptions<${names.errorType}>;`,
    '',
    `export const ${names.keyConstant} = '${names.validatorKey}';`,
    '',
    `function isValid${names.pascalName}(text_value: string): boolean {`,
    '  return text_value.trim() !== \'\';',
    '}',
    '',
    `export function ${names.checkFunction}(control_value: unknown, validator_options: ${names.optionsType}): ${names.errorType} | null {`,
    '  if (isEmptyValue(control_value)) {',
    '    return null;',
    '  }',
    `  if (!isBlankText(control_value) && isString(control_value) && isValid${names.pascalName}(control_value)) {`,
    '    return null;',
    '  }',
    '  const message = resolveMessage({',
    `    validatorKey: ${names.keyConstant},`,
    '    englishMessage: \'Enter a valid value.\',',
    '    errorParameters: {},',
    '    inlineLocale: validator_options.locale,',
    '    inlineMessage: validator_options.message',
    '  });',
    '  return {message};',
    '}'
  );
}

function renderReactive(names: ValidatorNames): string {
  return joinLines(
    'import type {ValidatorFn} from \'@angular/forms\';',
    'import {toReactiveValidator} from \'../../adapters/to-reactive-validator\';',
    `import {${names.checkFunction}, type ${names.optionsType}, ${names.keyConstant}} from './${names.kebabName}';`,
    '',
    '/**',
    ' * Describe what the validator accepts. Empty values are valid.',
    ' *',
    ' * @param validator_options - Locale and custom message.',
    ` * @returns A Reactive Forms validator reporting {@link ${names.errorType}} under \`errors.${names.validatorKey}\`.`,
    ' *',
    ' * @example',
    ' * ```ts',
    ` * new FormControl('', [${names.validatorKey}()]);`,
    ' * ```',
    ' *',
    ` * @see https://github.com/yarvanya/ngx-formpulse#${names.validatorKey.toLowerCase()}`,
    ' */',
    `export function ${names.validatorKey}(validator_options: ${names.optionsType} = {}): ValidatorFn {`,
    `  return toReactiveValidator(${names.keyConstant}, (control_value) => ${names.checkFunction}(control_value, validator_options));`,
    '}'
  );
}

function renderSignals(names: ValidatorNames): string {
  return joinLines(
    'import type {SchemaPath} from \'@angular/forms/signals\';',
    `import {${names.checkFunction}, type ${names.optionsType}, ${names.keyConstant}} from '../validators/${names.kebabName}/${names.kebabName}';`,
    'import {isFunction} from \'../utilities/core.utility\';',
    'import {applySignalValidator} from \'./apply-signal-validator\';',
    '',
    '/**',
    ' * Describe what the validator accepts in Signal Forms. Empty values are valid.',
    ' *',
    ' * @param schema_path - Field to validate.',
    ' * @param validator_options - Locale and custom message, or a function returning them.',
    ' *',
    ' * @example',
    ' * ```ts',
    ' * form(model, (path) => {',
    ` *   ${names.validatorKey}(path.value);`,
    ' * });',
    ' * ```',
    ' *',
    ` * @see https://github.com/yarvanya/ngx-formpulse#${names.validatorKey.toLowerCase()}`,
    ' */',
    `export function ${names.validatorKey}<TValue extends string | null | undefined>(`,
    '  schema_path: SchemaPath<TValue>,',
    `  validator_options: ${names.optionsType} | (() => ${names.optionsType}) = {}`,
    '): void {',
    `  applySignalValidator(schema_path, ${names.keyConstant}, (control_value) => ${names.checkFunction}(control_value, isFunction(validator_options) ? validator_options() : validator_options));`,
    '}'
  );
}

function renderCases(names: ValidatorNames): string {
  return joinLines(
    `export interface ${names.caseType} {`,
    '  readonly description: string;',
    '  readonly value: string | number | null;',
    '  readonly isValid: boolean;',
    '}',
    '',
    'const UNSUPPORTED_NUMBER_VALUE = 1;',
    '',
    `export const ${names.casesConstant}: readonly ${names.caseType}[] = [`,
    '  {description: \'an empty value\', value: \'\', isValid: true},',
    '  {description: \'null\', value: null, isValid: true},',
    '  {description: \'a number instead of text\', value: UNSUPPORTED_NUMBER_VALUE, isValid: false}',
    '];'
  );
}

function renderCoreSpec(names: ValidatorNames): string {
  return joinLines(
    `import {${names.checkFunction}} from '../../../lib/validators/${names.kebabName}/${names.kebabName}';`,
    `import {${names.casesConstant}} from '../../support/cases/${names.kebabName}.cases';`,
    '',
    `describe('${names.checkFunction}', () => {`,
    `  it.each(${names.casesConstant})('$description: valid is $isValid', ({value, isValid}) => {`,
    `    expect(${names.checkFunction}(value, {}) === null).toBe(isValid);`,
    '  });',
    '',
    '  it(\'reports an English message\', () => {',
    `    expect(${names.checkFunction}(' ', {})).toEqual({message: 'Enter a valid value.'});`,
    '  });',
    '});'
  );
}

function renderReactiveSpec(names: ValidatorNames): string {
  return joinLines(
    'import {FormControl} from \'@angular/forms\';',
    `import {${names.validatorKey}} from '../../../lib/validators/${names.kebabName}/${names.kebabName}.reactive';`,
    `import {${names.casesConstant}} from '../../support/cases/${names.kebabName}.cases';`,
    '',
    `describe('${names.validatorKey} (Reactive Forms)', () => {`,
    `  it.each(${names.casesConstant})('$description: valid is $isValid', ({value, isValid}) => {`,
    `    expect(new FormControl(value, [${names.validatorKey}()]).valid).toBe(isValid);`,
    '  });',
    '});'
  );
}

function renderSignalsSpec(names: ValidatorNames): string {
  return joinLines(
    'import {signal} from \'@angular/core\';',
    'import {TestBed} from \'@angular/core/testing\';',
    'import {form} from \'@angular/forms/signals\';',
    `import {${names.validatorKey}} from '../../lib/signals/${names.kebabName}';`,
    '',
    `describe('${names.validatorKey} (Signal Forms)', () => {`,
    '  it(\'reports the error with its kind\', () => {',
    '    const model = signal({value: \' \'});',
    '    const signalForm = TestBed.runInInjectionContext(() => form(model, (schema_path) => {',
    `      ${names.validatorKey}(schema_path.value);`,
    '    }));',
    `    expect(signalForm.value().errors()).toMatchObject([{kind: '${names.validatorKey}', message: 'Enter a valid value.'}]);`,
    '  });',
    '});'
  );
}

function renderPage(names: ValidatorNames): string {
  return joinLines(
    'import {ChangeDetectionStrategy, Component, effect, signal} from \'@angular/core\';',
    'import {FormControl} from \'@angular/forms\';',
    'import {form} from \'@angular/forms/signals\';',
    'import {MatCardModule} from \'@angular/material/card\';',
    'import {MatIconModule} from \'@angular/material/icon\';',
    'import {MatTabsModule} from \'@angular/material/tabs\';',
    `import {${names.casesConstant}} from '@formpulse/cases';`,
    `import {FpLocale, ${names.validatorKey}} from 'ngx-formpulse';`,
    `import {${names.validatorKey} as fpSignal${names.pascalName}} from 'ngx-formpulse/signals';`,
    'import {ApiTable, type ApiRow} from \'../../validator-page/api-table\';',
    'import {CasesTable} from \'../../validator-page/cases-table\';',
    'import {CodeExample} from \'../../validator-page/code-example\';',
    'import {LocaleSwitcher} from \'../../validator-page/locale-switcher\';',
    'import {ReactiveLiveField} from \'../../validator-page/reactive-live-field\';',
    'import {isString} from \'../../utilities/core.utility\';',
    'import {SignalLiveField} from \'../../validator-page/signal-live-field\';',
    '',
    '@Component({',
    `  selector: 'fp-${names.kebabName}-page',`,
    '  imports: [MatCardModule, MatIconModule, MatTabsModule, ApiTable, CasesTable, CodeExample, LocaleSwitcher, ReactiveLiveField, SignalLiveField],',
    '  changeDetection: ChangeDetectionStrategy.OnPush,',
    '  styleUrl: \'../../validator-page/validator-page.scss\',',
    `  templateUrl: './${names.kebabName}-page.html'`,
    '})',
    `export class ${names.pageClass} {`,
    `  protected readonly caseRows = ${names.casesConstant}.map((validator_case) => ({`,
    '    description: validator_case.description,',
    '    value: JSON.stringify(validator_case.value),',
    '    options: \'\',',
    '    isValid: validator_case.isValid',
    '  }));',
    '',
    '  protected readonly optionRows: readonly ApiRow[] = [',
    '    {name: \'locale\', type: \'FpLocale\', required: \'No\', defaultValue: \'global locale\', description: \'Message language for this validator only.\'},',
    `    {name: 'message', type: 'FpMessage<${names.errorType}>', required: 'No', defaultValue: 'built-in', description: 'Custom message.'}`,
    '  ];',
    '',
    '  protected readonly reactiveControl = new FormControl(\'\', {nonNullable: true});',
    '  protected readonly signalModel = signal({value: \'\'});',
    '  protected readonly locale = signal<FpLocale>(FpLocale.En);',
    '',
    '  protected readonly signalForm = form(this.signalModel, (schema_path) => {',
    `    fpSignal${names.pascalName}(schema_path.value, () => ({locale: this.locale()}));`,
    '  });',
    '',
    `  protected readonly reactiveCode = 'new FormControl(\\'\\', [${names.validatorKey}()]);';`,
    `  protected readonly signalCode = 'form(model, (path) => {\\n  ${names.validatorKey}(path.value);\\n});';`,
    '',
    '  constructor() {',
    '    effect(() => {',
    `      this.reactiveControl.setValidators(${names.validatorKey}({locale: this.locale()}));`,
    '      this.reactiveControl.updateValueAndValidity();',
    '    });',
    '  }',
    '',
    '  protected applyCase(case_index: number): void {',
    `    const caseValue = ${names.casesConstant}[case_index]?.value;`,
    '    const textValue = isString(caseValue) ? caseValue : String(caseValue ?? \'\');',
    '    this.reactiveControl.setValue(textValue);',
    '    this.reactiveControl.markAsDirty();',
    '    this.signalModel.set({value: textValue});',
    '    this.signalForm.value().markAsDirty();',
    '  }',
    '}'
  );
}

function renderPageTemplate(names: ValidatorNames): string {
  return joinLines(
    '<header class="validator-header">',
    '  <span class="validator-icon" aria-hidden="true"><mat-icon>fact_check</mat-icon></span>',
    '  <div>',
    `    <h1>${names.validatorKey}</h1>`,
    '    <p class="page-lead">Describe the validator in one sentence.</p>',
    '  </div>',
    '</header>',
    '',
    '<mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="150ms" class="validator-tabs">',
    '  <mat-tab label="Description">',
    '    <div class="tab-body">',
    '      <mat-card appearance="outlined" class="content-card">',
    '        <mat-card-content>',
    '          <h2>What it does</h2>',
    '          <ul class="feature-list">',
    '            <li>Empty values are valid.</li>',
    '          </ul>',
    '        </mat-card-content>',
    '      </mat-card>',
    '    </div>',
    '  </mat-tab>',
    '',
    '  <mat-tab label="API">',
    '    <div class="tab-body">',
    `      <fp-api-table caption="${names.optionsType}" [rows]="optionRows" />`,
    '    </div>',
    '  </mat-tab>',
    '',
    '  <mat-tab label="Examples">',
    '    <div class="tab-body">',
    '      <mat-card appearance="outlined" class="content-card">',
    '        <mat-card-content>',
    '          <h2>Options</h2>',
    '          <div class="options-panel">',
    '            <fp-locale-switcher [(locale)]="locale" />',
    '          </div>',
    '        </mat-card-content>',
    '      </mat-card>',
    '',
    '      <div class="card-grid">',
    '        <mat-card appearance="outlined" class="example-card">',
    '          <mat-card-header>',
    '            <mat-card-title>Reactive Forms</mat-card-title>',
    '          </mat-card-header>',
    '          <mat-card-content>',
    '            <fp-reactive-live-field label="Value (Reactive Forms)" [control]="reactiveControl" />',
    '            <fp-code-example title="Reactive Forms" [code]="reactiveCode" />',
    '          </mat-card-content>',
    '        </mat-card>',
    '        <mat-card appearance="outlined" class="example-card">',
    '          <mat-card-header>',
    '            <mat-card-title>Signal Forms</mat-card-title>',
    '          </mat-card-header>',
    '          <mat-card-content>',
    '            <fp-signal-live-field label="Value (Signal Forms)" [field]="signalForm.value" />',
    '            <fp-code-example title="Signal Forms" [code]="signalCode" />',
    '          </mat-card-content>',
    '        </mat-card>',
    '      </div>',
    '',
    '      <h2>Test cases</h2>',
    '      <fp-cases-table [rows]="caseRows" (applied)="applyCase($event)" />',
    '    </div>',
    '  </mat-tab>',
    '</mat-tab-group>'
  );
}

function renderEndToEndSpec(names: ValidatorNames): string {
  return joinLines(
    'import {expect, test} from \'../fixtures/sandbox-test\';',
    '',
    `test.describe('${names.validatorKey} page', () => {`,
    '  test.beforeEach(async ({openPage}) => {',
    `    await openPage('/validators/${names.kebabName}');`,
    '  });',
    '',
    '  test(\'shows the error in both form systems\', async ({page}) => {',
    '    await page.getByRole(\'tab\', {name: \'Examples\'}).click();',
    '    await page.getByLabel(\'Value (Reactive Forms)\').fill(\' \');',
    '    await page.getByLabel(\'Value (Signal Forms)\').fill(\' \');',
    '    await expect(page.getByLabel(\'Value (Reactive Forms)\')).toHaveAccessibleDescription(\'Enter a valid value.\');',
    '    await expect(page.getByLabel(\'Value (Signal Forms)\')).toHaveAccessibleDescription(\'Enter a valid value.\');',
    '  });',
    '',
    '  test(\'has no accessibility violations\', async ({expectNoAccessibilityViolations}) => {',
    '    await expectNoAccessibilityViolations();',
    '  });',
    '});'
  );
}

export function renderValidatorFiles(names: ValidatorNames): readonly GeneratedFile[] {
  const libraryValidator = `${LIBRARY_ROOT}/lib/validators/${names.kebabName}`;
  const testValidator = `${LIBRARY_ROOT}/unit-testing/validators/${names.kebabName}`;
  const sandboxPage = `projects/sandbox/src/app/validators/${names.kebabName}`;
  return [
    {path: `${libraryValidator}/${names.kebabName}.ts`, content: renderCore(names)},
    {path: `${libraryValidator}/${names.kebabName}.reactive.ts`, content: renderReactive(names)},
    {path: `${LIBRARY_ROOT}/lib/signals/${names.kebabName}.ts`, content: renderSignals(names)},
    {path: `${LIBRARY_ROOT}/unit-testing/support/cases/${names.kebabName}.cases.ts`, content: renderCases(names)},
    {path: `${testValidator}/${names.kebabName}.spec.ts`, content: renderCoreSpec(names)},
    {path: `${testValidator}/${names.kebabName}.reactive.spec.ts`, content: renderReactiveSpec(names)},
    {path: `${LIBRARY_ROOT}/unit-testing/signals/${names.kebabName}.spec.ts`, content: renderSignalsSpec(names)},
    {path: `${sandboxPage}/${names.kebabName}-page.ts`, content: renderPage(names)},
    {path: `${sandboxPage}/${names.kebabName}-page.html`, content: renderPageTemplate(names)},
    {path: `e2e/validators/${names.kebabName}.spec.ts`, content: renderEndToEndSpec(names)}
  ];
}

export function listManualSteps(names: ValidatorNames): readonly string[] {
  return [
    `Implement isValid${names.pascalName} and the error parameters in ${LIBRARY_ROOT}/lib/validators/${names.kebabName}/${names.kebabName}.ts.`,
    `Add "readonly ${names.validatorKey}: ${names.errorType};" to FpErrorMap (${LIBRARY_ROOT}/lib/core/fp-error-map.ts).`,
    `Add a ${names.validatorKey} message to all six locale packs (${LIBRARY_ROOT}/lib/locales/*/*.ts) and their specs.`,
    `Export ${names.validatorKey}, ${names.errorType} and ${names.optionsType} from lib/public-api.ts and ${names.validatorKey} from lib/signals/public-api.ts.`,
    `Export ${names.casesConstant} from ${LIBRARY_ROOT}/unit-testing/support/cases/index.ts and add real cases.`,
    `Add the /validators/${names.kebabName} route and a navigation link in the sandbox.`,
    'Add benchmark cases (tools/scripts/validators-benchmark.ts) and a size entry (.size-limit.json).',
    'Update README.md, CHANGELOG.md and NOTICE (if the validator uses third-party data).'
  ];
}
