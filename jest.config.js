/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@octokit/rest$': '<rootDir>/node_modules/@octokit/rest/dist-types/index.d.ts'
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['**/tests/**/*.test.ts'],
    transformIgnorePatterns: [
        'node_modules/(?!(@octokit|@octokit/.*|@octokit/core)/)'
    ],
    setupFiles: ['<rootDir>/jest.setup.js']
}; 