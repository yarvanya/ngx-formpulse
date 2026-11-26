import {writeFileSync} from 'node:fs';
import {FpCountry} from '../../projects/ngx-formpulse/lib/enums/fp-country';
import {parseCountryInfo} from '../lib/post-code-data/country-info-parser';
import {type PostCodeDataSource, renderPostCodeData} from '../lib/post-code-data/post-code-data-renderer';

const SOURCE_COMMIT = '5ef3a927bdd6002bf25c5c09029347bebf57a57b';
const SOURCE_FILE = 'testdata/countryinfo.txt';
const OUTPUT_FILE = 'projects/ngx-formpulse/lib/validators/post-code/post-code.data.ts';
const FAILURE_EXIT_CODE = 1;
const RETRIEVED_ON = '2026-11-26';

const DATA_SOURCE: PostCodeDataSource = {
  name: 'Google libaddressinput',
  url: 'https://github.com/google/libaddressinput',
  file: SOURCE_FILE,
  commit: SOURCE_COMMIT,
  license: 'Apache-2.0',
  retrievedOn: RETRIEVED_ON
};

async function importPostCodeData(): Promise<void> {
  const response = await fetch(`https://raw.githubusercontent.com/google/libaddressinput/${SOURCE_COMMIT}/${SOURCE_FILE}`);
  if (!response.ok) {
    throw new Error(`Download failed with status ${String(response.status)}.`);
  }
  const entries = parseCountryInfo(await response.text(), new Set<string>(Object.values(FpCountry)));
  writeFileSync(OUTPUT_FILE, renderPostCodeData(entries, DATA_SOURCE));
  console.log(`Wrote ${String(entries.length)} postal-code rules to ${OUTPUT_FILE}.`);
}

importPostCodeData().catch((error: unknown) => {
  console.error(error);
  process.exitCode = FAILURE_EXIT_CODE;
});
