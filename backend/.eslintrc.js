module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  // 'extends': 'eslint:recommended',
  extends: 'airbnb-base',
  parserOptions: {
    sourceType: 'module',
  },
  globals: {
    console: false,
  },
  rules: {
    indent: [
      'error',
      2,
      { SwitchCase: 1 },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'never',
    ],
    'no-console': 0,
    'prefer-destructuring': [
      'error',
      { object: false },
    ],
    'func-names': 0,
    'arrow-body-style': 0,
    'consistent-return': 0,
    'newline-per-chained-call': 0,
    'no-underscore-dangle': 0,
    'prefer-template': 0,
  },
}
