import {StatusBar, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import {ThemeType, useThemeStore} from './Stores/themeStore';
import {Colors} from './Constants/Colors';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import '../global.css';
import {useColorScheme} from 'nativewind';
import AppNavigation from './Navigation/AppNavigation';

const App = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const {colorScheme, setColorScheme} = useColorScheme();

  useEffect(() => {
    const nativewindScheme = isDarkMode ? 'dark' : 'light';
    if (colorScheme !== nativewindScheme) {
      setColorScheme(nativewindScheme);
    }
  }, [isDarkMode, colorScheme, setColorScheme]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'dark' : ''}`}>
        <StatusBar
          backgroundColor={
            isDarkMode
              ? Colors.DarkTheme.Background
              : Colors.LightTheme.Background
          }
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <AppNavigation />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
