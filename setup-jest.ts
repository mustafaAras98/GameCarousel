import '@testing-library/jest-native/extend-expect';
require('react-native-reanimated').setUpTests();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn().mockResolvedValue([]),
}));

jest.mock('@react-native-vector-icons/ionicons', () => {
  const MockIcon = ({
    name,
    size,
    color,
  }: {
    name: string;
    size?: number;
    color?: string;
  }) => {
    return `name: ${name}, size: ${size}, color:${color}`;
  };

  return MockIcon;
});
