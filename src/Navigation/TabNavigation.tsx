import React from 'react';

import {View} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../Screens/Home';
import Rankings from '../Screens/Rankings';
import Settings from '../Screens/Settings';
import CustomTabBar from './CustomTabBarComponent';

import {BottomTabParamList} from './Utils/NavigationTypes';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigation = () => {
  return (
    <View className="flex-1">
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }} // eslint-disable-next-line react/no-unstable-nested-components
        tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen name="Rankings" component={Rankings} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </View>
  );
};

export default React.memo(TabNavigation);
