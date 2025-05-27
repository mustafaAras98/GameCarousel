import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Snake from '../Screens/Games/Snake';

import TabNavigation from './TabNavigation';
import {RootStackParamList} from './Utils/NavigationTypes';
import {ThemeType, useThemeStore} from '../Stores/themeStore';
import {Colors} from '../Constants/Colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TabNavigation"
        screenOptions={{headerShown: false, gestureEnabled: true}}>
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
        <Stack.Group
          screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkMode
                ? Colors.DarkTheme.Background
                : Colors.LightTheme.Background,
            },
            headerTintColor: isDarkMode
              ? Colors.DarkTheme.Text
              : Colors.LightTheme.Text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: true,
            headerBackTitle: 'Back',
          }}>
          <Stack.Screen
            name="SnakeGameScreen"
            component={Snake}
            options={{
              title: 'Snake Game',
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default React.memo(AppNavigation);
