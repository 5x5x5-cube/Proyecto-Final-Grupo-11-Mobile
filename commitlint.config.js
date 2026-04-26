/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'ci'],
    ],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [0], // Disable subject-case rule
  },
};
