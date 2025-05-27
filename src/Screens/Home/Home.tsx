import {View, useWindowDimensions} from 'react-native';
import React from 'react';

import GameSelectionCarousel from '../../Components/GameSelectionCarousel';
import GameMarquee from '../../Components/GameMarquee';
import SwipeableTabWrapper from '../../Navigation/Utils/SwipeableTabWrapper';

const Home = () => {
  const {height} = useWindowDimensions();

  return (
    <SwipeableTabWrapper>
      <View className="flex-1 h-screen w-screen bg-lightbg dark:bg-darkbg">
        <View style={{height: height * 0.6, marginVertical: height * 0.05}}>
          <GameSelectionCarousel cardHeight={height * 0.6} />
        </View>
        <View style={{height: height * 0.15}}>
          <GameMarquee />
        </View>
      </View>
    </SwipeableTabWrapper>
  );
};

export default React.memo(Home);
