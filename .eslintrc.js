module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'semi': 'error',
    'curly': 'error',
    'eqeqeq': [ 'error', 'smart' ],
    'prefer-arrow-callback': 'error',
    'radix': 'error',
    'quotes': [ 'error', 'single', { avoidEscape: true } ],
    'no-await-in-loop': 'warn',
    'no-console': 'warn',
    'no-template-curly-in-string': 'warn',
    '@typescript-eslint/explicit-function-return-type': [ 'error', { allowExpressions: true } ],
    '@typescript-eslint/no-unused-vars': [ 'warn', { argsIgnorePattern: "^_" } ]
  }
}
