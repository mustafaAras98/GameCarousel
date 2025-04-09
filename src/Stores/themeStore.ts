import {Appearance} from 'react-native';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum Theme {
  LightTheme = 'LightTheme',
  DarkTheme = 'DarkTheme',
}

type ThemeMode = Theme.DarkTheme | Theme.LightTheme;

export interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}
const getInitialTheme = (): ThemeMode => {
  const systemScheme = Appearance.getColorScheme();
  return systemScheme === 'dark' ? Theme.DarkTheme : Theme.LightTheme;
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        theme: getInitialTheme(),
        setTheme: (theme: ThemeMode) => set({theme}),
      }),
      {name: 'themeStore', storage: createJSONStorage(() => AsyncStorage)}
    )
  )
);
