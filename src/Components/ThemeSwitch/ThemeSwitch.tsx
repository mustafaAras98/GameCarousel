import React, {useEffect, useMemo, useRef, useState} from 'react';
import {LayoutChangeEvent, Pressable} from 'react-native';

import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {useThemeStore, ThemeType} from '../../Stores/themeStore';

import {Colors, scaledPadding} from '../../Constants/Constants';
import Icon from '@react-native-vector-icons/ionicons';

type IoniconName = React.ComponentProps<typeof Icon>['name'];

interface ThemeSwitchProps {
  duration?: number;
  icons?: {
    on: IoniconName;
    off: IoniconName;
  };
  iconColors?: {
    on: string;
    off: string;
  };
  trackColors?: {
    on: string;
    off: string;
  };
}
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  duration = 600,
  icons = {on: 'sunny', off: 'moon'},
  iconColors = {
    on: Colors.ThemeSwitch.Icons.On,
    off: Colors.ThemeSwitch.Icons.Off,
  },
  trackColors = {
    on: Colors.ThemeSwitch.Track.On,
    off: Colors.ThemeSwitch.Track.Off,
  },
}) => {
  const [trackSize, setTrackSize] = useState({width: 120, height: 40});
  const [thumbSizeHeight, setThumbSizeHeight] = useState(40);
  const rotation = useSharedValue(0);
  const targetRotation = useRef(0);

  const iconSize = useMemo(
    () => Math.max(12, thumbSizeHeight - scaledPadding.xxs * 2),
    [thumbSizeHeight]
  );

  const setTheme = useThemeStore((state) => state.setTheme);
  const theme = useThemeStore((state) => state.theme);
  let isOn = theme === ThemeType.LightTheme;

  const handleThemeSwitchPress = () => {
    setTheme(isOn ? ThemeType.DarkTheme : ThemeType.LightTheme);
  };

  useEffect(() => {
    const newTarget = targetRotation.current + 360;
    targetRotation.current = newTarget;
    rotation.value = withTiming(newTarget, {duration});
  }, [theme, duration, rotation]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      isOn ? 1 : 0,
      [0, 1],
      [trackColors.off, trackColors.on]
    );
    const colorValue = withTiming(color, {duration});

    return {
      backgroundColor: colorValue,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const rawTravelDistance = trackSize.width - trackSize.height;
    const safeTravelDistance = Math.max(0, rawTravelDistance);
    const moveValue = interpolate(
      isOn ? 1 : 0,
      [0, 1],
      [0, safeTravelDistance]
    );
    const translateValue = withTiming(moveValue, {duration});

    return {
      transform: [{translateX: translateValue}],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  return (
    <Pressable
      testID="ThemeSwitchPressable"
      accessibilityRole="switch"
      accessibilityState={{checked: isOn}}
      accessibilityLabel="Tema Değiştir"
      className="flex w-full h-full items-center justify-center"
      onPress={handleThemeSwitchPress}>
      <Animated.View
        className="w-full h-full rounded-full justify-center items-start"
        onLayout={(e: LayoutChangeEvent) => {
          setTrackSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          });
        }}
        style={[
          {
            padding: scaledPadding.xxs,
            ...(trackSize.height >= trackSize.width && {aspectRatio: 1}),
          },
          trackAnimatedStyle,
        ]}>
        <Animated.View
          className="bg-white aspect-square rounded-full"
          onLayout={(e: LayoutChangeEvent) => {
            setThumbSizeHeight(e.nativeEvent.layout.height);
          }}
          style={thumbAnimatedStyle}>
          <Animated.View
            className=" w-full h-full items-center justify-center"
            style={iconAnimatedStyle}>
            <Icon
              size={iconSize}
              name={isOn ? icons.on : icons.off}
              color={isOn ? iconColors.on : iconColors.off}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default ThemeSwitch;
