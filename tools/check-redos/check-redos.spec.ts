import {checkRegularExpressions, selectUnsafeVerdicts} from './redos-checker';
import {findRegularExpressions} from './regular-expression-finder';

const FILE_NAME = 'example.ts';
const FIRST_LINE = 1;
const SECOND_LINE = 2;
const THIRD_LINE = 3;

describe('findRegularExpressions', () => {
  it('finds literals with their flags and lines', () => {
    const source = 'const DIGITS = /^\\d+$/u;\nconst WORDS = /\\w+/gi;';
    expect(findRegularExpressions(FILE_NAME, source)).toEqual([
      {fileName: FILE_NAME, line: FIRST_LINE, source: '^\\d+$', flags: 'u'},
      {fileName: FILE_NAME, line: SECOND_LINE, source: '\\w+', flags: 'gi'}
    ]);
  });

  it('finds RegExp constructor calls with string literals', () => {
    const source = 'const A = new RegExp(\'^a$\', \'i\');\nconst B = RegExp(\'^b$\');\nconst C = new RegExp(PATTERN);';
    expect(findRegularExpressions(FILE_NAME, source)).toEqual([
      {fileName: FILE_NAME, line: FIRST_LINE, source: '^a$', flags: 'i'},
      {fileName: FILE_NAME, line: SECOND_LINE, source: '^b$', flags: ''}
    ]);
  });

  it('ignores other constructors and calls without arguments', () => {
    const source = 'const A = new Date(\'2026\');\nconst B = new RegExp();\nconst C = new RegExp(\'^c$\', FLAGS);';
    expect(findRegularExpressions(FILE_NAME, source)).toEqual([
      {fileName: FILE_NAME, line: THIRD_LINE, source: '^c$', flags: ''}
    ]);
  });
});

describe('checkRegularExpressions', () => {
  it('accepts a safe pattern', () => {
    const verdicts = checkRegularExpressions(findRegularExpressions(FILE_NAME, 'const SAFE = /^\\d{5}$/;'));
    expect(selectUnsafeVerdicts(verdicts)).toEqual([]);
  });

  it('rejects a catastrophic backtracking pattern', () => {
    const verdicts = checkRegularExpressions(findRegularExpressions(FILE_NAME, 'const UNSAFE = /^(a+)+$/;'));
    expect(selectUnsafeVerdicts(verdicts)).toMatchObject([{status: 'vulnerable'}]);
  });
});
