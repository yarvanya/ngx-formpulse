import {checkRegularExpressions, selectUnsafeVerdicts} from '../../lib/check-redos/redos-checker';

const FILE_NAME = 'example.ts';
const FIRST_LINE = 1;

describe('checkRegularExpressions', () => {
  it('accepts a safe pattern', () => {
    const verdicts = checkRegularExpressions([{fileName: FILE_NAME, line: FIRST_LINE, source: '^\\d{5}$', flags: ''}]);
    expect(verdicts).toMatchObject([{status: 'safe'}]);
    expect(selectUnsafeVerdicts(verdicts)).toEqual([]);
  });

  it('rejects a catastrophic backtracking pattern', () => {
    const verdicts = checkRegularExpressions([{fileName: FILE_NAME, line: FIRST_LINE, source: '^(a+)+$', flags: ''}]);
    expect(selectUnsafeVerdicts(verdicts)).toMatchObject([{status: 'vulnerable'}]);
  });
});
