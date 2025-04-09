import React, {useEffect, useRef, useState} from 'react';
import {LayoutChangeEvent, Pressable} from 'react-native';

import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {Theme, useThemeStore} from '../../Stores/themeStore';

import {styles} from './ThemeSwitch.style';
import {BasePadding, Colors} from '../../Constants/Constants';
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
  const [trackSize, setTrackSize] = useState({width: 50, height: 20});
  const rotation = useSharedValue(0);
  const targetRotation = useRef(0);
  const iconSize = Math.max(12, trackSize.height - BasePadding.medium * 3);

  const setTheme = useThemeStore((state) => state.setTheme);
  const theme = useThemeStore((state) => state.theme);
  const isOn = theme === Theme.LightTheme;

  const handleThemeSwitchPress = () => {
    setTheme(isOn ? Theme.DarkTheme : Theme.LightTheme);
  };

  useEffect(() => {
    const newTarget = targetRotation.current + 360;
    targetRotation.current = newTarget;
    rotation.value = withTiming(newTarget, {duration});
  }, [duration, rotation, isOn]);

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
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{checked: isOn}}
      accessibilityLabel="Tema Değiştir"
      style={styles.Container}
      onPress={handleThemeSwitchPress}>
      <Animated.View
        onLayout={(e: LayoutChangeEvent) => {
          setTrackSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          });
        }}
        style={[styles.Track, trackAnimatedStyle]}>
        <Animated.View style={[styles.Thumb, thumbAnimatedStyle]}>
          <Animated.View style={[styles.IconContainer, iconAnimatedStyle]}>
            <Icon
              style={styles.Icon}
              adjustsFontSizeToFit
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
