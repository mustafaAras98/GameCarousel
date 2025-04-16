import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {games} from '../../Models/Games';

interface GamesInterface {
  height: number;
  width: number;
  x: SharedValue<number>;
}

const GameLogoSlider: React.FC<GamesInterface> = ({x, width, height}) => {
  const marginTop = height * 0.4;
  const marginBot = height * 0.2;
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{marginTop: marginTop, marginBottom: marginBot}}
      pointerEvents="none">
      {games.map((game, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const animatedStyle = useAnimatedStyle(() => {
          const translateX = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [width / 2.5, 0, -width / 2.5]
          );
          const scale = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.6, 1, 0.6]
          );
          return {
            transform: [{translateX}, {scale}],
          };
        });
        return (
          <Animated.View
            key={index}
            className="justify-center items-center"
            style={[{...StyleSheet.absoluteFillObject}, animatedStyle]}>
            <Image
              source={game.imgSrc}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: height - marginBot - marginTop,
                height: height - marginBot - marginTop,
                objectFit: 'contain',
              }}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};

export default GameLogoSlider;
