import {FpCountry} from '../../../lib/enums/fp-country';
import {POST_CODE_DATA_SOURCE, POST_CODE_RULES} from '../../../lib/validators/post-code/post-code.data';

const MINIMUM_COUNTRY_COUNT = 170;
const COUNTRY_CODES = new Set<string>(Object.values(FpCountry));

describe('POST_CODE_RULES', () => {
  it('covers the countries with postal codes in the data source', () => {
    expect(Object.keys(POST_CODE_RULES).length).toBeGreaterThan(MINIMUM_COUNTRY_COUNT);
  });

  it('uses only FpCountry codes', () => {
    for (const country of Object.keys(POST_CODE_RULES)) {
      expect(COUNTRY_CODES.has(country)).toBe(true);
    }
  });

  it('anchors every pattern', () => {
    for (const postCodeRule of Object.values(POST_CODE_RULES)) {
      expect(postCodeRule.pattern.source.startsWith('^(?:')).toBe(true);
      expect(postCodeRule.pattern.source.endsWith(')$')).toBe(true);
    }
  });

  it('accepts every example of its own country', () => {
    for (const postCodeRule of Object.values(POST_CODE_RULES)) {
      for (const example of postCodeRule.examples) {
        expect(postCodeRule.pattern.test(example)).toBe(true);
      }
    }
  });
});

describe('POST_CODE_DATA_SOURCE', () => {
  it('records Google libaddressinput under Apache-2.0', () => {
    expect(POST_CODE_DATA_SOURCE).toMatchObject({name: 'Google libaddressinput', license: 'Apache-2.0', commit: '5ef3a927bdd6002bf25c5c09029347bebf57a57b'});
  });
});
