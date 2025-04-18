import {
  StatusBar,
  SafeAreaView,
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import {ThemeType, useThemeStore} from './Stores/themeStore';
import {Colors} from './Constants/Colors';

import '../global.css';
import {useColorScheme} from 'nativewind';
import GameSelectionCarousel from './Components/GameSelectionCarousel';
import ThemeSwitch from './Components/ThemeSwitch';

const App = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const {colorScheme, setColorScheme} = useColorScheme();

  useEffect(() => {
    const nativewindScheme = theme === ThemeType.DarkTheme ? 'dark' : 'light';
    if (colorScheme !== nativewindScheme) {
      setColorScheme(nativewindScheme);
    }
  }, [theme, setColorScheme, colorScheme]);

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? 'dark' : ''}`}
      style={style.AndroidSafeArea}>
      <StatusBar
        backgroundColor={
          isDarkMode
            ? Colors.DarkTheme.background
            : Colors.LightTheme.background
        }
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <View className="flex-1 h-screen w-screen bg-lightbackground dark:bg-darkbackground">
        <GameSelectionCarousel cardHeight={400} />
      </View>
      <View className="absolute size-16 w-screen bottom-0 left-0">
        <ThemeSwitch />
      </View>
    </SafeAreaView>
  );
};

export default App;

const style = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
