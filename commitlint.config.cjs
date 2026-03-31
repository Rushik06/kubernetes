module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'ci',
        'revert'
      ]
    ],
    'header-max-length': [2, 'always', 100],
    'subject-full-stop': [2, 'never', '.'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case']
  }
};