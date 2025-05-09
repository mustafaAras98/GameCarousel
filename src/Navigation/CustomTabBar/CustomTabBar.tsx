import React, {useCallback, useEffect, useMemo} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {Route} from '@react-navigation/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import {ThemeType, useThemeStore} from '../../Stores/themeStore';

import {scale} from '../../Constants/Constants';
import {Colors} from '../../Constants/Colors';

import TabBarItem from './TabBarItem';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const tabBarHeight = screenHeight * 0.1;
const indicatorHeight = scale(4);
const whiteColor = 'rgba(244, 238, 236, 0.4)';
const blackColor = 'rgba(11, 13, 19, 0.4)';

const CustomTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const theme = useThemeStore((themeState) => themeState.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const tabWidth = useMemo(
    () => screenWidth / state.routes.length,
    [state.routes.length]
  );
  const indicatorWidth = useMemo(() => tabWidth / 2, [tabWidth]);
  const indicatorOffset = useMemo(() => tabWidth / 4, [tabWidth]);
  const tabBarShadowColor = useMemo(
    () => (isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text),
    [isDarkMode]
  );
  const edgeColor = useMemo(
    () => (isDarkMode ? whiteColor : blackColor),
    [isDarkMode]
  );
  const middleColor = useMemo(
    () => (isDarkMode ? blackColor : whiteColor),
    [isDarkMode]
  );

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth + indicatorOffset, {
      damping: 15,
      stiffness: 100,
    });
  }, [state.index, tabWidth, translateX, indicatorOffset]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
    width: indicatorWidth,
  }));

  return (
    <View
      className="flex-row bg-lightbg dark:bg-darkbg"
      style={[
        styles.shadowContainer,
        {
          height: tabBarHeight,
          shadowColor: tabBarShadowColor,
        },
      ]}>
      <Animated.View
        className="absolute top-0 bg-lighttext dark:bg-darktext rounded-md z-10"
        style={[
          {
            height: indicatorHeight,
            width: tabWidth / 2,
          },
          animatedIndicatorStyle,
        ]}
      />
      {state.routes.map((route: Route<string>, index: number) => {
        const descriptorKey = route.key as keyof typeof descriptors;
        const descriptor = descriptors[descriptorKey];
        if (!descriptor) {
          console.warn(`Descriptor not found for route key: ${route.key}`);
          return null;
        }
        const isFocused = state.index === index;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const onPress = useCallback(() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }, [isFocused, route.key, route.name, route.params]);
        return (
          <TabBarItem
            key={route.key}
            route={route}
            descriptor={descriptor}
            isFocused={isFocused}
            onPress={onPress}
            tabWidth={tabWidth}
            isDarkMode={isDarkMode}
            edgeColor={edgeColor}
            middleColor={middleColor}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default React.memo(CustomTabBar);
