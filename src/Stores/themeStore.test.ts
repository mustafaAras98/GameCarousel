import {renderHook, act} from '@testing-library/react-native';

import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useThemeStore, ThemeType} from './themeStore';

jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(),
  },
}));

describe('Theme Store', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should initialize with light theme when system is light', async () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const {result} = renderHook(() => useThemeStore());

    await act(async () => {
      await result.current.initializeTheme();
    });

    expect(result.current.theme).toBe(ThemeType.LightTheme);
  });

  it('should initialize with dark theme when system is dark', async () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const {result} = renderHook(() => useThemeStore());

    await act(async () => {
      await result.current.initializeTheme();
    });

    expect(result.current.theme).toBe(ThemeType.DarkTheme);
  });

  it('should change theme when setTheme is called', () => {
    const {result} = renderHook(() => useThemeStore());

    act(() => {
      result.current.setTheme(ThemeType.DarkTheme);
    });

    expect(result.current.theme).toBe(ThemeType.DarkTheme);

    act(() => {
      result.current.setTheme(ThemeType.LightTheme);
    });

    expect(result.current.theme).toBe(ThemeType.LightTheme);
  });

  it('should persist theme changes to AsyncStorage', async () => {
    const {result} = renderHook(() => useThemeStore());

    act(() => {
      result.current.setTheme(ThemeType.DarkTheme);
    });

    const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
    expect(calls[0][0]).toBe('themeStore');

    const savedState = JSON.parse(calls[0][1]);
    expect(savedState.state.theme).toBe(ThemeType.DarkTheme);
  });
});
