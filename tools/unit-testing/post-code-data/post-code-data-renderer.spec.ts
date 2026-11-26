import {type PostCodeDataSource, renderPostCodeData} from '../../lib/post-code-data/post-code-data-renderer';

const DATA_SOURCE: PostCodeDataSource = {
  name: 'Google libaddressinput',
  url: 'https://github.com/google/libaddressinput',
  file: 'testdata/countryinfo.txt',
  commit: 'abc',
  license: 'Apache-2.0',
  retrievedOn: '2026-11-26'
};

describe('renderPostCodeData', () => {
  const renderedModule = renderPostCodeData([
    {country: 'GB', pattern: 'GIR[ ]?0AA', examples: []},
    {country: 'UA', pattern: '\\d{5}', examples: ['01001', 'O\'1']}
  ], DATA_SOURCE);

  it('renders anchored regex literals keyed by country code', () => {
    expect(renderedModule).toContain('  GB: {pattern: /^(?:GIR[ ]?0AA)$/, examples: []},\n');
    expect(renderedModule).toContain('  UA: {pattern: /^(?:\\d{5})$/, examples: [\'01001\', \'O\\\'1\']}\n');
  });

  it('renders the data source as a constant', () => {
    expect(renderedModule).toContain('export const POST_CODE_DATA_SOURCE = {\n  name: \'Google libaddressinput\',');
    expect(renderedModule).toContain('  retrievedOn: \'2026-11-26\'\n} as const;');
  });

  it('imports the FpCountry type and declares the rule type', () => {
    expect(renderedModule.startsWith('import type {FpCountry} from \'../../enums/fp-country\';\n')).toBe(true);
    expect(renderedModule).toContain('export interface PostCodeRule {');
  });
});
