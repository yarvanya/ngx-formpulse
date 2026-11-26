import {isEmptyValue} from './empty-value';

const ZERO = 0;

describe('isEmptyValue', () => {
  it.each([
    {description: 'an empty string', controlValue: ''},
    {description: 'null', controlValue: null},
    {description: 'undefined', controlValue: undefined}
  ])('treats $description as empty', ({controlValue}) => {
    expect(isEmptyValue(controlValue)).toBe(true);
  });

  it.each([
    {description: 'whitespace', controlValue: ' '},
    {description: 'zero', controlValue: ZERO},
    {description: 'false', controlValue: false},
    {description: 'an empty array', controlValue: []}
  ])('treats $description as a value', ({controlValue}) => {
    expect(isEmptyValue(controlValue)).toBe(false);
  });
});
