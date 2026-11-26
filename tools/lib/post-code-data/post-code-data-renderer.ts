import type {PostCodeEntry} from './country-info-parser';

export interface PostCodeDataSource {
  readonly name: string;
  readonly url: string;
  readonly file: string;
  readonly commit: string;
  readonly license: string;
  readonly retrievedOn: string;
}

function quote(text: string): string {
  return `'${text.replaceAll('\\', '\\\\').replaceAll('\'', '\\\'')}'`;
}

function renderEntry(entry: PostCodeEntry): string {
  const examples = entry.examples.map((example) => quote(example)).join(', ');
  return `  ${entry.country}: {pattern: /^(?:${entry.pattern})$/, examples: [${examples}]}`;
}

export function renderPostCodeData(entries: readonly PostCodeEntry[], data_source: PostCodeDataSource): string {
  return [
    'import type {FpCountry} from \'../../enums/fp-country\';',
    '',
    'export interface PostCodeRule {',
    '  readonly pattern: RegExp;',
    '  readonly examples: readonly string[];',
    '}',
    '',
    'export const POST_CODE_DATA_SOURCE = {',
    `  name: ${quote(data_source.name)},`,
    `  url: ${quote(data_source.url)},`,
    `  file: ${quote(data_source.file)},`,
    `  commit: ${quote(data_source.commit)},`,
    `  license: ${quote(data_source.license)},`,
    `  retrievedOn: ${quote(data_source.retrievedOn)}`,
    '} as const;',
    '',
    'export const POST_CODE_RULES: Readonly<Partial<Record<FpCountry, PostCodeRule>>> = {',
    entries.map((entry) => renderEntry(entry)).join(',\n'),
    '};',
    ''
  ].join('\n');
}
