/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  "preset": 'ts-jest',
  "testEnvironment": "jest-environment-node",
  "verbose": true,
  "transform": {
    '^.+\\.tsx?$': [
      "ts-jest",
      { "tsconfig": "./tsconfig.json" }
    ]
  }
};