import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, RadialGradient, Rect, vec} from '@shopify/react-native-skia';

import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {Route} from '@react-navigation/native';

import {Colors} from '../../Constants/Colors';
import {scale} from '../../Constants/Constants';

import Icon from '@react-native-vector-icons/ionicons';
import IoniconsGlyph from 'react-native-vector-icons/dist/glyphmaps/Ionicons.json';

interface TabItemProps {
  route: Route<string>;
  descriptor: {
    options: BottomTabNavigationOptions;
    render?: () => React.ReactNode;
  };
  isFocused: boolean;
  onPress: () => void;
  tabWidth: number;
  isDarkMode: boolean;
  edgeColor: string;
  middleColor: string;
}

const {height: screenHeight} = Dimensions.get('window');
const TAB_BAR_HEIGHT = screenHeight * 0.1;
type IoniconsIconNames = keyof typeof IoniconsGlyph;

const getIconName = (
  routeName: string,
  isFocused: boolean
): IoniconsIconNames => {
  switch (routeName) {
    case 'Home':
      return isFocused ? 'home' : 'home-outline';
    case 'Rankings':
      return isFocused ? 'podium' : 'podium-outline';
    case 'Settings':
      return isFocused ? 'settings' : 'settings-outline';
    default:
      return 'help-circle-outline';
  }
};

const TabBarItem: React.FC<TabItemProps> = ({
  route,
  descriptor,
  isFocused,
  onPress,
  tabWidth,
  isDarkMode,
  edgeColor,
  middleColor,
}) => {
  const iconScale = useSharedValue(1);
  const tabOpacity = useSharedValue(0);

  useEffect(() => {
    tabOpacity.value = withTiming(isFocused ? 1 : 0, {duration: 300});
    if (isFocused) {
      iconScale.value = withSpring(1.3, {}, () => {
        iconScale.value = withSpring(1);
      });
    } else {
      iconScale.value = withSpring(1);
    }
  }, [isFocused, iconScale, tabOpacity]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: iconScale.value}],
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabOpacity.value,
  }));

  const {options} = descriptor;
  const label = options.tabBarLabel ?? route.name;

  return (
    <TouchableOpacity
      key={route.key}
      accessibilityRole="button"
      accessibilityLabel={label as string}
      accessibilityState={isFocused ? {selected: true} : {}}
      onPress={onPress}
      style={{width: tabWidth}}
      className="flex-1 justify-center bg-lightbg dark:bg-darkbg items-center z-0">
      <Animated.View style={[styles.containerAbsolute, gradientAnimatedStyle]}>
        <Canvas style={styles.containerAbsolute}>
          <Rect x={0} y={0} width={tabWidth} height={TAB_BAR_HEIGHT}>
            <RadialGradient
              c={vec(tabWidth * 0.5, 0)}
              r={TAB_BAR_HEIGHT * 0.7}
              colors={[edgeColor, middleColor]}
            />
          </Rect>
        </Canvas>
      </Animated.View>
      <Animated.View
        style={iconAnimatedStyle}
        className="flex w-full h-3/5 justify-center items-center">
        <Icon
          size={scale(32)}
          name={getIconName(route.name, isFocused)}
          color={isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerAbsolute: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
});

export default React.memo(TabBarItem);
