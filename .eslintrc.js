// eslint 설정 파일

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'jsx-a11y', 'import', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
  ],
  rules: {
    'no-console': ['error', { allow: ['error'] }],
    'prettier/prettier': 'off',
    semi: ['error', 'never'],
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-anonymous-default-export': ['warn', { allowObject: true }],
    'import/no-unresolved': 'off',
    'consistent-return': 'warn',
    'no-return-assign': 'off',
    'no-eq-null': 'error',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['ctx'] }],
    'no-underscore-dangle': 'off',
    'no-mixed-operators': 'off',
    'no-nested-ternary': 'off',
    'object-curly-spacing': ['error', 'always'],
    'linebreak-style': 'off',
    'no-unused-vars': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    // 'no-use-before-define': 'off',
    'newline-per-chained-call': 'off',
    'array-element-newline': ['error', 'consistent'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['off'],
    indent: [
      'off',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        ignoredNodes: ['PropertyDefinition'],
      },
    ],
    camelcase: 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: '@style/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@icon/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@*',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
      },
    ],
    'prefer-destructuring': 'warn',
    'arrow-body-style': 'off',
    'object-curly-newline': ['warn', { consistent: true }],
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/forbid-prop-types': 'off',
    'react/sort-comp': 'off',
    'react/jsx-filename-extension': 'off',
    'react/require-default-props': 'off',
    'react/jsx-first-prop-new-line': [1, 'multiline'],
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off', // props validation by typescript
    'no-confusing-arrow': 0,
    'react/destructuring-assignment': 'off',
    'react/jsx-wrap-multilines': 'off',
    'space-infix-ops': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'off',
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],

    // Disabled by duplicated with prettier setting
    quotes: 'off',
    'jsx-quotes': 'off',
    'comma-dangle': 'off',
    'max-len': 'off',
    'arrow-parens': 'off',

    // fix typescript syntax error
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/ban-tslint-ignore': 'off',
    // "@typescript-eslint/indent": ["warn", 2],
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {
        accessibility: 'no-public',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-extra-semi': 'warn',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js'],
      },
    },
  },
}
