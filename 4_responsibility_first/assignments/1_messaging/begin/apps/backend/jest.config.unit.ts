import type { JestConfigWithTsJest } from 'ts-jest';

export default async (): Promise<JestConfigWithTsJest> => ({
  displayName: 'Backend (Unit)',
  testMatch: ['**/src/**/*.@(unit).*'],
  testPathIgnorePatterns: ['/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {}],
  }
});