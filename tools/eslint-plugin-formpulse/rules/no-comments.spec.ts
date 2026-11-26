import {RuleTester} from 'eslint';
import tseslint from 'typescript-eslint';
import {noComments} from './no-comments.mjs';

const LIBRARY_FILE = 'projects/ngx-formpulse/src/lib/core/fp-locale.ts';
const LIBRARY_SPEC_FILE = 'projects/ngx-formpulse/src/lib/core/fp-locale.spec.ts';
const SANDBOX_FILE = 'projects/sandbox/src/app/app.ts';

const RULE_TESTER = new RuleTester({
  languageOptions: {
    parser: tseslint.parser
  }
});

RULE_TESTER.run('no-comments', noComments, {
  valid: [
    {code: 'const value = 1;', filename: SANDBOX_FILE},
    {code: '/** Public locale. */\nexport enum FpLocale {En = \'en\'}', filename: LIBRARY_FILE},
    {code: '/** Public provider. */\nexport function provideFormPulse(): void {}', filename: LIBRARY_FILE},
    {code: '/** Public pack. */\nexport const fpLocaleUk = {};', filename: LIBRARY_FILE},
    {code: '/** Windows path. */\nexport type FpError = string;', filename: 'D:\\work\\projects\\ngx-formpulse\\src\\lib\\core\\fp-error.ts'},
    {code: '#!/usr/bin/env node\nconst value = 1;', filename: 'tools/script.mjs'}
  ],
  invalid: [
    {code: '// note\nconst value = 1;', filename: SANDBOX_FILE, errors: [{messageId: 'comment'}]},
    {code: '/* note */\nconst value = 1;', filename: LIBRARY_FILE, errors: [{messageId: 'comment'}]},
    {code: '/** Docs outside the library. */\nexport const value = 1;', filename: SANDBOX_FILE, errors: [{messageId: 'comment'}]},
    {code: '/** Docs in a spec. */\nexport function fpHelper(): void {}', filename: LIBRARY_SPEC_FILE, errors: [{messageId: 'comment'}]},
    {code: '/** Internal helper. */\nexport function resolveMessage(): void {}', filename: LIBRARY_FILE, errors: [{messageId: 'comment'}]},
    {code: '/** Not exported. */\nfunction fpHidden(): void {}', filename: LIBRARY_FILE, errors: [{messageId: 'comment'}]},
    {code: '/** Re-export. */\nexport {FpLocale} from \'./fp-locale\';', filename: LIBRARY_FILE, errors: [{messageId: 'comment'}]},
    {code: '/** Trailing. */', filename: LIBRARY_FILE, errors: [{messageId: 'comment'}]},
    {code: 'const value = 1;\n/** After code. */\nconst other = value;', filename: LIBRARY_FILE, errors: [{messageId: 'comment'}]},
    {code: '/* v8 ignore next */\nconst value = 1;', filename: SANDBOX_FILE, errors: [{messageId: 'coverageIgnore'}]},
    {code: '// istanbul ignore next\nconst value = 1;', filename: LIBRARY_FILE, errors: [{messageId: 'coverageIgnore'}]}
  ]
});
