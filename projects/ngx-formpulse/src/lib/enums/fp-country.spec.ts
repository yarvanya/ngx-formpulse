import {FP_COUNTRY_SOURCE, FpCountry} from './fp-country';

const ASSIGNED_CODE_COUNT = 249;
const ALPHA_TWO_PATTERN = /^[A-Z]{2}$/;

describe('FpCountry', () => {
  it('contains every officially assigned ISO 3166-1 alpha-2 code', () => {
    expect(Object.keys(FpCountry)).toHaveLength(ASSIGNED_CODE_COUNT);
  });

  it('uses the code itself as member name and value', () => {
    for (const [memberName, memberValue] of Object.entries(FpCountry)) {
      expect(memberValue).toBe(memberName);
      expect(memberValue).toMatch(ALPHA_TWO_PATTERN);
    }
  });

  it('contains Ukraine', () => {
    expect(FpCountry.UA).toBe('UA');
  });

  it('records its source', () => {
    expect(FP_COUNTRY_SOURCE.standard).toBe('ISO 3166-1 alpha-2');
  });
});
