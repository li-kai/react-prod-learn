module.exports = {
  testEnvironment: 'node',
  testURL: 'http://localhost',
  roots: [
    '<rootDir>/__tests__',
    '<rootDir>/src',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js?(x)',
    '<rootDir>/src/**/?(*.)(spec|test).js?(x)',
  ],
  testPathIgnorePatterns: [
    '.eslintrc.js',
    '<rootDir>[/\\\\](dist|docs|node_modules)[/\\\\]',
  ],
  moduleNameMapper: { // allow mock for css modules
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js|jsx}',
  ],
  // Only write lcov files in CIs
  coverageReporters: ['text'].concat(process.env.CI ? 'lcov' : []),
};
