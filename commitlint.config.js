/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => message.startsWith('Merge')],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'ci'],
    ],
    'subject-max-length': [2, 'always', 100],
  },
};
