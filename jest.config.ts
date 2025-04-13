import type {Config} from 'jest';

const config: Config = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./setup-jest.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@testing-library|react-native-reanimated|nativewind)/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
