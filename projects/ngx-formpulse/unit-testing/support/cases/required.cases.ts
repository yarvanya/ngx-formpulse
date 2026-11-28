export type RequiredValueKind = 'text' | 'number' | 'boolean' | 'list' | 'other';

export interface RequiredCase {
  readonly description: string;
  readonly value: unknown;
  readonly valueLabel: string;
  readonly kind: RequiredValueKind;
  readonly isValid: boolean;
}

const QUANTITY = 3;
const NEGATIVE_NUMBER = -5;
const INVALID_DATE_TEXT = 'not a date';
const VALID_DATE_TEXT = '2026-11-28';

function createFileList(file_count: number): ArrayLike<string> {
  const fileList = {length: file_count, [Symbol.toStringTag]: 'FileList'};
  return fileList;
}

export const REQUIRED_CASES: readonly RequiredCase[] = [
  {description: 'null', value: null, valueLabel: 'null', kind: 'other', isValid: false},
  {description: 'undefined', value: undefined, valueLabel: 'undefined', kind: 'other', isValid: false},
  {description: 'empty text', value: '', valueLabel: '\'\'', kind: 'text', isValid: false},
  {description: 'spaces only', value: '   ', valueLabel: '\'   \'', kind: 'text', isValid: false},
  {description: 'non-breaking spaces and a tab', value: '  \t', valueLabel: '\'\\u00A0\\u00A0\\t\'', kind: 'text', isValid: false},
  {description: 'line breaks only', value: '\n\n', valueLabel: '\'\\n\\n\'', kind: 'text', isValid: false},
  {description: 'text', value: 'Ivan', valueLabel: '\'Ivan\'', kind: 'text', isValid: true},
  {description: 'text with surrounding spaces', value: ' Ivan ', valueLabel: '\' Ivan \'', kind: 'text', isValid: true},
  {description: 'the digit 0 as text', value: '0', valueLabel: '\'0\'', kind: 'text', isValid: true},
  {description: 'zero', value: 0, valueLabel: '0', kind: 'number', isValid: true},
  {description: 'negative zero', value: -0, valueLabel: '-0', kind: 'number', isValid: true},
  {description: 'a positive number', value: QUANTITY, valueLabel: String(QUANTITY), kind: 'number', isValid: true},
  {description: 'a negative number', value: NEGATIVE_NUMBER, valueLabel: String(NEGATIVE_NUMBER), kind: 'number', isValid: true},
  {description: 'infinity', value: Number.POSITIVE_INFINITY, valueLabel: 'Infinity', kind: 'number', isValid: true},
  {description: 'not a number', value: Number.NaN, valueLabel: 'NaN', kind: 'number', isValid: false},
  {description: 'unchecked checkbox', value: false, valueLabel: 'false', kind: 'boolean', isValid: true},
  {description: 'checked checkbox', value: true, valueLabel: 'true', kind: 'boolean', isValid: true},
  {description: 'empty selection', value: [], valueLabel: '[]', kind: 'list', isValid: false},
  {description: 'selection of one item', value: ['uk'], valueLabel: '[\'uk\']', kind: 'list', isValid: true},
  {description: 'selection of a zero value', value: [0], valueLabel: '[0]', kind: 'list', isValid: true},
  {description: 'empty Set', value: new Set<string>(), valueLabel: 'new Set()', kind: 'other', isValid: false},
  {description: 'Set with an item', value: new Set(['uk']), valueLabel: 'new Set([\'uk\'])', kind: 'other', isValid: true},
  {description: 'empty Map', value: new Map<string, string>(), valueLabel: 'new Map()', kind: 'other', isValid: false},
  {description: 'Map with an entry', value: new Map([['uk', 'Ukrainian']]), valueLabel: 'new Map([[\'uk\', \'Ukrainian\']])', kind: 'other', isValid: true},
  {description: 'no file chosen', value: createFileList(0), valueLabel: 'FileList (0 files)', kind: 'other', isValid: false},
  {description: 'one file chosen', value: createFileList(1), valueLabel: 'FileList (1 file)', kind: 'other', isValid: true},
  {description: 'invalid date', value: new Date(INVALID_DATE_TEXT), valueLabel: `new Date('${INVALID_DATE_TEXT}')`, kind: 'other', isValid: false},
  {description: 'valid date', value: new Date(VALID_DATE_TEXT), valueLabel: `new Date('${VALID_DATE_TEXT}')`, kind: 'other', isValid: true},
  {description: 'empty object', value: {}, valueLabel: '{}', kind: 'other', isValid: true},
  {description: 'selected record', value: {id: 1}, valueLabel: '{id: 1}', kind: 'other', isValid: true},
  {description: 'zero as a big integer', value: 0n, valueLabel: '0n', kind: 'other', isValid: true}
];
