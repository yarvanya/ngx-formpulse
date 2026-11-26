import {planValidatorFiles} from '../../lib/validator-generator/validator-generator';

const GENERATED_FILES = [
  {path: 'lib/iban.ts', content: 'core\n'},
  {path: 'lib/iban.reactive.ts', content: 'reactive\n'}
];

describe('planValidatorFiles', () => {
  it('writes every file when none exists', () => {
    expect(planValidatorFiles(GENERATED_FILES, new Set())).toEqual({filesToWrite: GENERATED_FILES, conflictingPaths: []});
  });

  it('writes nothing and reports conflicts when a file exists', () => {
    expect(planValidatorFiles(GENERATED_FILES, new Set(['lib/iban.reactive.ts']))).toEqual({filesToWrite: [], conflictingPaths: ['lib/iban.reactive.ts']});
  });
});
