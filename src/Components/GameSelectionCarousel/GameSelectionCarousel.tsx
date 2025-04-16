import {View, useWindowDimensions} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import GameLogoSlider from './GamesLogoSlider';
import Card from './Card';
import {games} from '../../Models/Games';

interface GameSelectionCarouselI {
  cardHeight: number;
}

const GameSelectionCarousel: React.FC<GameSelectionCarouselI> = ({
  cardHeight,
}) => {
  const {width} = useWindowDimensions();

  const translateX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      translateX.value = event.contentOffset.x;
    },
  });

  return (
    <View className="flex-1 bg-lightbackground dark:bg-darkbackground items-center">
      <Animated.ScrollView
        horizontal
        onScroll={onScroll}
        scrollEventThrottle={4}
        decelerationRate="fast"
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        /* contentContainerClassName="items-center justify-center" */
      >
        {games.map((game, index) => (
          <View style={{height: cardHeight}} key={index}>
            <Card game={game} width={width} key={index} />
          </View>
        ))}
      </Animated.ScrollView>
      <View
        className="absolute"
        style={{
          height: cardHeight,
        }}>
        <GameLogoSlider height={cardHeight} width={width} x={translateX} />
      </View>
    </View>
  );
};

export default GameSelectionCarousel;
