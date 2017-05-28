module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: [
    'airbnb',
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  plugins: [
    'import',
    'jsx-a11y',
    'react',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/webpack.config.common.js',
      },
    },
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': [
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
      ]
    }],
    'react/jsx-filename-extension': 'off',
    // SEE: https://github.com/yannickcr/eslint-plugin-react/issues
    'react/no-unused-prop-types': 'off',
    // Let git handle the linebreaks instead.
    'linebreak-style': 'off',
  },
};
