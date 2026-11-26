export interface PostCodeEntry {
  readonly country: string;
  readonly pattern: string;
  readonly examples: readonly string[];
}

interface CountryRecord {
  readonly zip?: string;
  readonly zipex?: string;
}

const COUNTRY_LINE_PATTERN = /^data\/(?<country>[A-Z]{2})=(?<record>\{.*\})$/;
const EXAMPLE_SEPARATOR = ',';
const ESCAPED_HYPHEN_BEFORE_CLASS_END = /\\-(?=\])/g;

function normalizePattern(source_pattern: string): string {
  return source_pattern.replace(ESCAPED_HYPHEN_BEFORE_CLASS_END, '-');
}

function readExamples(country_record: CountryRecord, pattern: string): string[] {
  if (country_record.zipex === undefined) {
    return [];
  }
  const anchoredPattern = new RegExp(`^(?:${pattern})$`);
  return country_record.zipex
    .split(EXAMPLE_SEPARATOR)
    .map((example) => example.trim())
    .filter((example) => example !== '' && anchoredPattern.test(example));
}

export function parseCountryInfo(source_text: string, accepted_countries: ReadonlySet<string>): PostCodeEntry[] {
  const entries: PostCodeEntry[] = [];
  for (const line of source_text.split('\n')) {
    const match = COUNTRY_LINE_PATTERN.exec(line.trim());
    const country = match?.groups?.['country'];
    const record = match?.groups?.['record'];
    if (country === undefined || record === undefined || !accepted_countries.has(country)) {
      continue;
    }
    const countryRecord = JSON.parse(record) as CountryRecord;
    if (countryRecord.zip === undefined) {
      continue;
    }
    const pattern = normalizePattern(countryRecord.zip);
    entries.push({country, pattern, examples: readExamples(countryRecord, pattern)});
  }
  return entries.sort((first_entry, second_entry) => first_entry.country.localeCompare(second_entry.country));
}
