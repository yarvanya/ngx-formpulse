import {normalizeLetterCase, normalizeWhitespace} from '../../lib/core/normalize';

describe('normalizeWhitespace', () => {
  it('trims surrounding whitespace in tolerant mode', () => {
    expect(normalizeWhitespace('  01001 ', false)).toBe('01001');
  });

  it('keeps the value unchanged in strict mode', () => {
    expect(normalizeWhitespace('  01001 ', true)).toBe('  01001 ');
  });
});

describe('normalizeLetterCase', () => {
  it('upper-cases the value in tolerant mode', () => {
    expect(normalizeLetterCase('sw1a 1aa', false)).toBe('SW1A 1AA');
  });

  it('keeps the value unchanged in strict mode', () => {
    expect(normalizeLetterCase('sw1a 1aa', true)).toBe('sw1a 1aa');
  });
});
