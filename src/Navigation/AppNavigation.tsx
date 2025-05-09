import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';

import Home from '../Screens/Home';
import Rankings from '../Screens/Rankings';
import Settings from '../Screens/Settings';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const navigation = useNavigation();

  const {width} = Dimensions.get('window');
  const edgeWidth = width * 0.4;

  const startXRef = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((event) => {
      startXRef.value = event.absoluteX;
    })
    .activeOffsetX([-40, 40])
    .failOffsetY([-20, 20])
    .onEnd((event) => {
      const routes = navigation.getState()?.routes || [];
      const currentRouteIndex = navigation.getState()?.index || 0;

      const swipeThreshold = 40;
      const velocityThreshold = 0.4;

      const isLeftEdge = startXRef.value <= edgeWidth;
      const isRightEdge = startXRef.value >= width - edgeWidth;

      if (routes.length === 0) {
        return;
      }
      if (
        isRightEdge &&
        (event.translationX < -swipeThreshold ||
          event.velocityX < -velocityThreshold)
      ) {
        const nextIndex = Math.min(currentRouteIndex + 1, routes.length - 1);
        if (nextIndex !== currentRouteIndex && routes[nextIndex]) {
          navigation.navigate(routes[nextIndex].name as never);
        }
      } else if (
        isLeftEdge &&
        (event.translationX > swipeThreshold ||
          event.velocityX > velocityThreshold)
      ) {
        const prevIndex = Math.max(currentRouteIndex - 1, 0);
        if (prevIndex !== currentRouteIndex && routes[prevIndex]) {
          navigation.navigate(routes[prevIndex].name as never);
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View className="flex-1">
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBar={(props) => <CustomTabBar {...props} />}>
          <Tab.Screen name="Rankings" component={Rankings} />
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </View>
    </GestureDetector>
  );
};

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
};

export default AppNavigation;
