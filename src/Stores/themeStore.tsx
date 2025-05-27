import {Appearance} from 'react-native';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum ThemeType {
  LightTheme = 'LightTheme',
  DarkTheme = 'DarkTheme',
}

type ThemeMode = ThemeType.DarkTheme | ThemeType.LightTheme;

export interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        theme: ThemeType.LightTheme,
        setTheme: (theme: ThemeMode) => set({theme}),
        initializeTheme: async () => {
          try {
            const savedTheme = await AsyncStorage.getItem('themeStore');
            if (!savedTheme) {
              const colorScheme = Appearance.getColorScheme();
              const schemeTheme: ThemeType =
                colorScheme === 'dark'
                  ? ThemeType.DarkTheme
                  : ThemeType.LightTheme;
              useThemeStore.getState().setTheme(schemeTheme);
            }
          } catch (error) {
            console.error('Error loading theme from storage:', error);
          }
        },
      }),
      {name: 'themeStore', storage: createJSONStorage(() => AsyncStorage)}
    )
  )
);
