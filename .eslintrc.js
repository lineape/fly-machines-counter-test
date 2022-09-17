module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],

  settings: { react: { version: 'detect' } },

  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    'simple-import-sort/imports': 'error',

    // not needed as ts checks this for us or disabled for performance reasons
    '@typescript-eslint/no-unused-vars': 'off', // ts checks this
    '@typescript-eslint/unbound-method': 'off',
    'import/export': 'off', // ts checks this
    'import/namespace': 'off', // ts checks this
    'import/no-unresolved': 'off', // ts checks this
    'no-unused-vars': 'off', // ts checks this
  },

  overrides: [
    {
      files: [`./packages/app/**/*.{ts,tsx}`],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: { project: [`./packages/app/tsconfig.json`] },
      rules: {
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
      },
    },
  ],
};
