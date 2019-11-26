/** @type {import('@jest/types/build/Config').InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  moduleFileExtensions: ['js', 'ts'],
  errorOnDeprecated: true,
  restoreMocks: true,
};
