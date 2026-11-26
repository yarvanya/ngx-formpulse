import {isBlankText, isEmptyValue} from '../../lib/core/empty-value';

describe('isBlankText', () => {
  it.each([' ', '   ', '\t\n', ' '])('treats %j as blank', (text_value) => {
    expect(isBlankText(text_value)).toBe(true);
  });

  it.each(['', 'a', ' a ', null, undefined])('does not treat %j as blank', (control_value) => {
    expect(isBlankText(control_value)).toBe(false);
  });
});

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
