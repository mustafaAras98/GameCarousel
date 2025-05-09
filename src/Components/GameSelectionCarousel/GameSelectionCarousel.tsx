import {View, useWindowDimensions, NativeModules} from 'react-native';
import React, {useEffect} from 'react';
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
const {SoundModule} = NativeModules;

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

  useEffect(() => {
    SoundModule.loadSound('click', 'card_button_click');

    return () => {
      SoundModule.unloadSound('click');
    };
  }, []);

  return (
    <View className="flex-1 items-center">
      <Animated.ScrollView
        horizontal
        onScroll={onScroll}
        scrollEventThrottle={4}
        decelerationRate="fast"
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}>
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

export default React.memo(GameSelectionCarousel);
