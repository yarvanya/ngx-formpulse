import {noComments} from './rules/no-comments.mjs';

export const formPulsePlugin = {
  meta: {
    name: 'eslint-plugin-formpulse'
  },
  rules: {
    'no-comments': noComments
  }
};
