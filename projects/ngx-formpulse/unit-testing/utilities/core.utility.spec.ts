import {isFunction, isNumber, isObject, isString} from '../../lib/utilities/core.utility';

const NUMBER_VALUE = 42;

describe('isString', () => {
  it.each(['', 'text'])('accepts %j', (value) => {
    expect(isString(value)).toBe(true);
  });

  it.each([null, undefined, NUMBER_VALUE, {}, []])('rejects %j', (value) => {
    expect(isString(value)).toBe(false);
  });
});

describe('isFunction', () => {
  it('accepts functions', () => {
    expect(isFunction(() => 'value')).toBe(true);
  });

  it.each([null, undefined, 'text', {}])('rejects %j', (value) => {
    expect(isFunction(value)).toBe(false);
  });
});

describe('isObject', () => {
  it.each([{}, [], new Date()])('accepts %j', (value) => {
    expect(isObject(value)).toBe(true);
  });

  it.each([null, undefined, 'text', NUMBER_VALUE])('rejects %j', (value) => {
    expect(isObject(value)).toBe(false);
  });
});

describe('isNumber', () => {
  it.each([0, NUMBER_VALUE, Number.NaN])('accepts %j', (value) => {
    expect(isNumber(value)).toBe(true);
  });

  it.each([null, undefined, '1', {}])('rejects %j', (value) => {
    expect(isNumber(value)).toBe(false);
  });
});
