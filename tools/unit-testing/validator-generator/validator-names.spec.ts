import {createValidatorNames} from '../../lib/validator-generator/validator-names';

describe('createValidatorNames', () => {
  it('derives every name from a kebab-case name', () => {
    expect(createValidatorNames('post-code')).toEqual({
      kebabName: 'post-code',
      camelName: 'postCode',
      pascalName: 'PostCode',
      validatorKey: 'fpPostCode',
      errorType: 'FpPostCodeError',
      optionsType: 'FpPostCodeOptions',
      checkFunction: 'checkPostCode',
      keyConstant: 'POST_CODE_VALIDATOR_KEY',
      casesConstant: 'POST_CODE_CASES',
      caseType: 'PostCodeCase',
      pageClass: 'PostCodePage'
    });
  });

  it('handles a single word', () => {
    expect(createValidatorNames('iban')).toMatchObject({camelName: 'iban', validatorKey: 'fpIban', keyConstant: 'IBAN_VALIDATOR_KEY'});
  });

  it.each(['', 'Post-code', 'post_code', 'post--code', '-post'])('rejects "%s"', (invalid_name) => {
    expect(() => createValidatorNames(invalid_name)).toThrow('is not a kebab-case validator name');
  });
});
