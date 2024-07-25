/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig = {
  // https://jestjs.io/docs/configuration#testenvironment-string
  // https://github.com/facebook/jest/issues/12131
  // https://github.com/facebook/jest/issues/12189#issuecomment-1001059449
  // https://github.com/facebook/jest/issues/12200
  testEnvironment: 'jsdom',

  moduleDirectories: [
    'node_modules',
    '<rootDir>',
  ],

  // jest temp directory
  // This configuration is required to
  // avoid the saturation of the filesystem /tmp
  cacheDirectory: '<rootDir>/jest/tmp',

  // Automatically clear mock
  // calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set
  // of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!node_modules/**',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/target/coverage',

  // coverage reporters
  coverageReporters: [
    'text',
    'html',
    'lcov',
  ],

  // test reporter
  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: 'target/jest-stare',
        coverageLink: '../coverage/index.html',
        log: true,
      },
    ],
  ],

  // code coverage percent
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // ignore coverage patterns (!only for unnecessary files)
  coveragePathIgnorePatterns: [],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
  ],

  // The paths to modules that run some code
  // to configure or set up the testing environment before each test
  setupFilesAfterEnv: [
    '<rootDir>/config/setupTests.js',
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js?(x)',
    '<rootDir>/**/*-(spec|test|Test).js?(x)',
    '<rootDir>/**/*.(spec|test|Test).js?(x)',
  ],

  // test result processor
  testResultsProcessor: 'jest-sonar-reporter',

  // An array of regexp pattern strings that
  // are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/jest/tmp',
  ],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testEnvironmentOptions: {
    url: 'http://localhost',
  },

  // Indicates whether each individual test should be reported during the run
  verbose: false,
};

export default async () => ({
  ...(await createJestConfig(customJestConfig)()),
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    '<rootDir>/node_modules/.pnpm/(?!@babel/runtime|css-)',
    '<rootDir>/node_modules/(?!@babel/runtime|css-)',
    '<rootDir>/jest/tmp',
  ],
});
