import {formPulsePlugin} from '../../lib/eslint-plugin-formpulse/index.mjs';
import {noComments} from '../../lib/eslint-plugin-formpulse/rules/no-comments.mjs';

describe('formPulsePlugin', () => {
  it('is named after FormPulse', () => {
    expect(formPulsePlugin.meta.name).toBe('eslint-plugin-formpulse');
  });

  it('registers the no-comments rule', () => {
    expect(formPulsePlugin.rules).toEqual({'no-comments': noComments});
  });
});
