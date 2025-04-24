import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeModules,
} from 'react-native';
import React from 'react';

import {GamesType} from '../../Models/Games';
import {Colors} from '../../Constants/Colors';

import {ThemeType, useThemeStore} from '../../Stores/themeStore';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {SoundModule} = NativeModules;

interface CardInterface {
  game: GamesType;
  width: number;
}

const Card: React.FC<CardInterface> = ({game, width}) => {
  const marginH = width / 24;
  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const buttonScale = useSharedValue<number>(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: buttonScale.value}],
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, {
      damping: 10,
      stiffness: 150,
      velocity: 1,
    });

    SoundModule.playSound('click');
  };

  const handlePressOut = () => {
    buttonScale.value = withSequence(
      withTiming(1.1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(1, {
        duration: 500,
        easing: Easing.elastic(1),
      })
    );
  };

  return (
    <View
      className="h-full"
      style={{
        width: width - marginH * 2,
        marginHorizontal: marginH,
      }}>
      <View
        className="flex-1 rounded-3xl justify-between p-2"
        style={[{backgroundColor: game.color}, style(isDarkMode).cardShadow]}>
        <View className="basis-2/5 p-4">
          <View
            accessibilityRole="header"
            accessibilityLabel={game.title}
            className="grow p-4 justify-center items-center">
            <Text
              adjustsFontSizeToFit
              className="text-lightext text-3xl font-bold tracking-wide line-clamp-1 align-middle text-center">
              {game.title}
            </Text>
          </View>
          <View
            className="grow rounded-b-2xl justify-center items-center"
            accessibilityLabel={game.description}>
            <Text
              adjustsFontSizeToFit
              className="text-base text-lightext font-medium align-middle text-center">
              {game.description}
            </Text>
          </View>
        </View>
        <View className="basis-1/5 px-8 justify-center items-center">
          <Animated.View
            className="flex w-full h-full justify-center items-center"
            style={animatedButtonStyle}>
            <TouchableOpacity
              className="bg-amber-950 w-full h-3/5 rounded-full justify-center items-center"
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Play ${game.title}`}
              accessibilityHint="Tap to start the game">
              <Text className="text-base text-darktext dark:text-darktext font-medium align-middle text-center">
                Oyna
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(Card);

const style = (isDarkTheme: boolean) =>
  StyleSheet.create({
    cardShadow: {
      shadowColor: isDarkTheme ? Colors.DarkTheme.text : Colors.LightTheme.text,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
  });
