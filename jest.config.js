/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      'expo|@expo|expo-modules-core|expo-font|expo-linear-gradient|expo-status-bar' +
      '|react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|@tanstack/react-query' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|react-native-svg' +
      '|react-native-qrcode-svg' +
      ')/)',
  ],
  moduleNameMapper: {
    '@expo/vector-icons': '<rootDir>/__mocks__/@expo/vector-icons.js',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.skeleton.tsx', '!src/**/*.d.ts'],
};
