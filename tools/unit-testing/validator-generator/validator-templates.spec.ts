import {createValidatorNames} from '../../lib/validator-generator/validator-names';
import {listManualSteps, renderValidatorFiles} from '../../lib/validator-generator/validator-templates';

const IBAN_NAMES = createValidatorNames('iban');
const EXPECTED_FILE_COUNT = 10;
const EXPECTED_STEP_COUNT = 8;

describe('renderValidatorFiles', () => {
  const generatedFiles = renderValidatorFiles(IBAN_NAMES);

  function findContent(file_path: string): string {
    return generatedFiles.find((generated_file) => generated_file.path === file_path)?.content ?? '';
  }

  it('creates every file of the validator anatomy', () => {
    expect(generatedFiles.map((generated_file) => generated_file.path)).toEqual([
      'projects/ngx-formpulse/lib/validators/iban/iban.ts',
      'projects/ngx-formpulse/lib/validators/iban/iban.reactive.ts',
      'projects/ngx-formpulse/lib/signals/iban.ts',
      'projects/ngx-formpulse/unit-testing/support/cases/iban.cases.ts',
      'projects/ngx-formpulse/unit-testing/validators/iban/iban.spec.ts',
      'projects/ngx-formpulse/unit-testing/validators/iban/iban.reactive.spec.ts',
      'projects/ngx-formpulse/unit-testing/signals/iban.spec.ts',
      'projects/sandbox/src/app/validators/iban/iban-page.ts',
      'projects/sandbox/src/app/validators/iban/iban-page.html',
      'e2e/validators/iban.spec.ts'
    ]);
    expect(generatedFiles).toHaveLength(EXPECTED_FILE_COUNT);
  });

  it('names the public API with the fp prefix', () => {
    expect(findContent('projects/ngx-formpulse/lib/validators/iban/iban.ts')).toContain('export type FpIbanError = FpError;');
    expect(findContent('projects/ngx-formpulse/lib/validators/iban/iban.reactive.ts')).toContain('export function fpIban(validator_options: FpIbanOptions = {}): ValidatorFn {');
    expect(findContent('projects/ngx-formpulse/lib/signals/iban.ts')).toContain('export function fpIban<TValue extends string | null | undefined>(');
  });

  it('ends every file with a single newline and contains no line comments', () => {
    for (const generatedFile of generatedFiles) {
      expect(generatedFile.content.endsWith('\n')).toBe(true);
      expect(generatedFile.content.endsWith('\n\n')).toBe(false);
      expect(generatedFile.content).not.toMatch(/^\s*\/\/ /m);
    }
  });

  it('wires the sandbox page to the cases and both form systems', () => {
    const pageSource = findContent('projects/sandbox/src/app/validators/iban/iban-page.ts');
    expect(pageSource).toContain('import {IBAN_CASES} from \'@formpulse/cases\';');
    expect(pageSource).toContain('import {fpIban as fpSignalIban} from \'ngx-formpulse/signals\';');
    expect(findContent('e2e/validators/iban.spec.ts')).toContain('await openPage(\'/validators/iban\');');
  });
});

describe('listManualSteps', () => {
  it('lists every manual step with the validator names', () => {
    const manualSteps = listManualSteps(IBAN_NAMES);
    expect(manualSteps).toHaveLength(EXPECTED_STEP_COUNT);
    expect(manualSteps[1]).toBe('Add "readonly fpIban: FpIbanError;" to FpErrorMap (projects/ngx-formpulse/lib/core/fp-error-map.ts).');
  });
});
