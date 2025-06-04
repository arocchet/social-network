const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/jest.globalSetup.js',
  globalTeardown: '<rootDir>/jest.globalTeardown.js',
  verbose: true,
}

module.exports = createJestConfig(customJestConfig)