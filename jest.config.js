module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/app/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
