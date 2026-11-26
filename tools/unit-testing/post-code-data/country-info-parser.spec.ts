import {parseCountryInfo} from '../../lib/post-code-data/country-info-parser';

const ACCEPTED_COUNTRIES = new Set(['UA', 'US', 'AE', 'GB']);

const SOURCE_TEXT = [
  'data={"id":"data","countries":"UA~US~AE~XK"}',
  'data/US={"id":"data/US","key":"US","zip":"\\\\d{5}([ \\\\-]\\\\d{4})?","zipex":"95014,22162-1010"}',
  'data/UA={"id":"data/UA","key":"UA","zip":"\\\\d{5}","zipex":"15432, 01001,,2005"}',
  'data/AE={"id":"data/AE","key":"AE","name":"UNITED ARAB EMIRATES"}',
  'data/XK={"id":"data/XK","key":"XK","zip":"[1-7]\\\\d{4}"}',
  'data/GB={"id":"data/GB","key":"GB","zip":"GIR[ ]?0AA"}',
  'data/US/CA={"id":"data/US/CA","zip":"9[0-5]"}',
  'not a data line'
].join('\n');

describe('parseCountryInfo', () => {
  it('reads accepted countries with a postal-code pattern, sorted by code', () => {
    expect(parseCountryInfo(SOURCE_TEXT, ACCEPTED_COUNTRIES).map((entry) => entry.country)).toEqual(['GB', 'UA', 'US']);
  });

  it('keeps only examples that match their own pattern', () => {
    const ukraine = parseCountryInfo(SOURCE_TEXT, ACCEPTED_COUNTRIES).find((entry) => entry.country === 'UA');
    expect(ukraine).toEqual({country: 'UA', pattern: '\\d{5}', examples: ['15432', '01001']});
  });

  it('removes a needless escape before the end of a character class', () => {
    const unitedStates = parseCountryInfo(SOURCE_TEXT, ACCEPTED_COUNTRIES).find((entry) => entry.country === 'US');
    expect(unitedStates?.pattern).toBe('\\d{5}([ -]\\d{4})?');
  });

  it('returns no examples when the source has none', () => {
    const unitedKingdom = parseCountryInfo(SOURCE_TEXT, ACCEPTED_COUNTRIES).find((entry) => entry.country === 'GB');
    expect(unitedKingdom?.examples).toEqual([]);
  });
});
