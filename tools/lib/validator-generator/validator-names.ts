export interface ValidatorNames {
  readonly kebabName: string;
  readonly camelName: string;
  readonly pascalName: string;
  readonly validatorKey: string;
  readonly errorType: string;
  readonly optionsType: string;
  readonly checkFunction: string;
  readonly keyConstant: string;
  readonly casesConstant: string;
  readonly caseType: string;
  readonly pageClass: string;
}

const KEBAB_NAME_PATTERN = /^[a-z]+(?:-[a-z]+)*$/;
const WORD_SEPARATOR = '-';

function capitalize(word: string): string {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

export function createValidatorNames(kebab_name: string): ValidatorNames {
  if (!KEBAB_NAME_PATTERN.test(kebab_name)) {
    throw new Error(`"${kebab_name}" is not a kebab-case validator name, e.g. "post-code".`);
  }
  const words = kebab_name.split(WORD_SEPARATOR);
  const pascalName = words.map((word) => capitalize(word)).join('');
  const constantName = words.map((word) => word.toUpperCase()).join('_');
  return {
    kebabName: kebab_name,
    camelName: `${words[0] ?? ''}${words.slice(1).map((word) => capitalize(word)).join('')}`,
    pascalName,
    validatorKey: `fp${pascalName}`,
    errorType: `Fp${pascalName}Error`,
    optionsType: `Fp${pascalName}Options`,
    checkFunction: `check${pascalName}`,
    keyConstant: `${constantName}_VALIDATOR_KEY`,
    casesConstant: `${constantName}_CASES`,
    caseType: `${pascalName}Case`,
    pageClass: `${pascalName}Page`
  };
}
