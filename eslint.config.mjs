import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import angular from 'angular-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import {formPulsePlugin} from './tools/lib/eslint-plugin-formpulse/index.mjs';

const ALLOWED_ABBREVIATIONS = {
  fp: true,
  Fp: true,
  IBAN: true,
  BIC: true,
  URL: true,
  UUID: true,
  IP: true,
  CVV: true,
  VAT: true,
  JSON: true,
  SSR: true,
  ISO: true
};

const ALLOWED_NUMBERS = [-1, 0, 1];

const PUBLIC_API_CONTEXTS = [
  'ExportNamedDeclaration > FunctionDeclaration[id.name=/^(fp|provideFormPulse$)/]',
  'ExportNamedDeclaration > VariableDeclaration[declarations.0.id.name=/^fp/]',
  'ExportNamedDeclaration > TSTypeAliasDeclaration[id.name=/^Fp/]',
  'ExportNamedDeclaration > TSInterfaceDeclaration[id.name=/^Fp/]',
  'ExportNamedDeclaration > TSEnumDeclaration[id.name=/^Fp/]'
];

const PUBLIC_OVERLOAD_CONTEXTS = [
  'ExportNamedDeclaration > TSDeclareFunction[id.name=/^fp/]'
];

const FRAMEWORK_AGNOSTIC_FILES = [
  'projects/ngx-formpulse/lib/core/**/*.ts',
  'projects/ngx-formpulse/lib/validators/**/*.ts'
];

const sharedRules = {
  'formpulse/no-comments': 'error',
  '@stylistic/list-style': ['error', {singleLine: {spacing: 'never'}, overrides: {'{}': {singleLine: {spacing: 'never'}}}}],
  '@stylistic/max-statements-per-line': 'error',
  'unicorn/name-replacements': ['error', {
    allowList: ALLOWED_ABBREVIATIONS,
    checkFilenames: true,
    replacements: {
      i: {index: true},
      j: {index: true},
      idx: {index: true}
    }
  }]
};

export default tseslint.config(
  {
    ignores: ['dist/', 'coverage/', '.angular/', 'node_modules/', 'out-tsc/', 'playwright-report/', 'test-results/']
  },
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'off'
    }
  },
  {
    plugins: {
      formpulse: formPulsePlugin,
      unicorn
    }
  },
  {
    files: ['**/*.ts', '**/*.mjs'],
    ...stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: true,
      commaDangle: 'never',
      braceStyle: '1tbs',
      arrowParens: true,
      blockSpacing: false,
      quoteProps: 'as-needed'
    })
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      ...sharedRules,
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': ['error', {
        ignore: ALLOWED_NUMBERS,
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
        ignoreTypeIndexes: true,
        enforceConst: true
      }],
      '@typescript-eslint/naming-convention': [
        'error',
        {selector: 'default', format: ['camelCase'], leadingUnderscore: 'forbid', trailingUnderscore: 'forbid'},
        {selector: 'parameter', format: ['snake_case']},
        {selector: 'parameter', modifiers: ['destructured'], format: ['camelCase']},
        {selector: 'variable', modifiers: ['const', 'global'], format: ['UPPER_CASE']},
        {selector: 'variable', modifiers: ['const', 'global', 'exported'], format: ['UPPER_CASE', 'camelCase']},
        {selector: 'variable', modifiers: ['destructured'], format: ['camelCase']},
        {selector: 'typeLike', format: ['PascalCase']},
        {selector: 'typeParameter', format: ['PascalCase'], prefix: ['T']},
        {selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE']},
        {selector: 'import', format: ['camelCase', 'PascalCase']},
        {selector: 'objectLiteralProperty', format: ['camelCase', 'UPPER_CASE']},
        {selector: ['objectLiteralProperty', 'typeProperty'], modifiers: ['requiresQuotes'], format: null}
      ],
      '@angular-eslint/component-selector': ['error', {type: 'element', prefix: 'fp', style: 'kebab-case'}],
      '@angular-eslint/directive-selector': ['error', {type: 'attribute', prefix: 'fp', style: 'camelCase'}]
    }
  },
  {
    files: ['projects/ngx-formpulse/lib/**/*.ts'],
    plugins: {jsdoc},
    settings: {
      jsdoc: {mode: 'typescript', tagNamePreference: {template: 'typeParam'}}
    },
    rules: {
      'jsdoc/require-jsdoc': ['error', {
        publicOnly: false,
        require: {FunctionDeclaration: false},
        contexts: [...PUBLIC_API_CONTEXTS, ...PUBLIC_OVERLOAD_CONTEXTS],
        exemptOverloadedImplementations: true
      }],
      'jsdoc/require-description': ['error', {contexts: [...PUBLIC_API_CONTEXTS, ...PUBLIC_OVERLOAD_CONTEXTS]}],
      'jsdoc/require-example': ['error', {contexts: [...PUBLIC_API_CONTEXTS, ...PUBLIC_OVERLOAD_CONTEXTS]}],
      'jsdoc/require-param': ['error', {contexts: [...PUBLIC_API_CONTEXTS, ...PUBLIC_OVERLOAD_CONTEXTS]}],
      'jsdoc/require-returns': ['error', {contexts: PUBLIC_API_CONTEXTS}],
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': ['error', {definedTags: ['typeParam']}],
      'jsdoc/no-types': 'error'
    }
  },
  {
    files: ['projects/ngx-formpulse/lib/**/*.ts'],
    ignores: ['projects/ngx-formpulse/lib/signals/**'],
    rules: {
      'no-restricted-imports': ['error', {paths: [{name: '@angular/forms/signals', message: 'Only ngx-formpulse/signals may import Signal Forms.'}]}]
    }
  },
  {
    files: FRAMEWORK_AGNOSTIC_FILES,
    ignores: ['**/*.reactive.ts'],
    rules: {
      'no-restricted-imports': ['error', {patterns: [{group: ['@angular/*', 'rxjs', 'rxjs/*'], message: 'Core and validator logic must stay framework-agnostic.'}]}]
    }
  },
  {
    files: ['*.config.ts', '*.config.mjs', 'e2e/**/*.ts', 'tools/**/*.ts', 'tools/**/*.mjs'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['*.config.ts', '*.config.mjs'],
    rules: {
      'unicorn/name-replacements': ['error', {allowList: ALLOWED_ABBREVIATIONS, checkFilenames: false}]
    }
  },
  {
    files: ['**/*.mjs'],
    extends: [eslint.configs.recommended],
    rules: {
      ...sharedRules,
      'unicorn/name-replacements': ['error', {allowList: ALLOWED_ABBREVIATIONS, checkFilenames: false}],
      'no-magic-numbers': ['error', {ignore: ALLOWED_NUMBERS, enforceConst: true}]
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ]
  }
);
