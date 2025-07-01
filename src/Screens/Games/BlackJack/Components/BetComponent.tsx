import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import React, {useRef, useState} from 'react';
import Animated, {
  FadeInDown,
  FadeOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import ChipComponent from './ChipComponent';

import {PositionObjectType} from '../../../../Constants/Constants';

import coinStore from '../../../../Stores/coinStore';

const screenWidth = Dimensions.get('screen').width;
const betAmounts: number[] = [5, 25, 50, 100, 250];

interface BetComponentI {
  currentBet: number;
  prevBet: number;
  handlePlay: () => void;
  addToBet: (amount: number) => void;
  delToBet: (amount: number) => void;
  clearBet: () => void;
}
const BetComponent: React.FC<BetComponentI> = ({
  currentBet,
  prevBet,
  handlePlay,
  addToBet,
  delToBet,
  clearBet,
}) => {
  const coins = coinStore((state) => state.coins);
  const betCircleRef = useRef<View>(null);

  const [betCirclePosition, setBetCirclePosition] =
    useState<PositionObjectType>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  const measureBetCirclePosition = () => {
    if (betCircleRef.current) {
      betCircleRef.current.measureInWindow((x, y, width, height) => {
        setBetCirclePosition({x, y, width, height});
      });
    }
  };

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      className="absolute bottom-0 w-full h-1/3 justify-around items-center">
      <View className="flex-row h-2/3 gap-4 justify-around items-center">
        {currentBet > 0 && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            className="h-1/3 w-1/4 bg-commonred rounded-lg justify-center items-center">
            <TouchableOpacity
              className="flex-1 justify-center items-center"
              onPress={clearBet}>
              <Text className="text-darktext font-bold">Clear Bet</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {prevBet !== 0 && currentBet === 0 && coins >= prevBet && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            className="absolute h-1/3 w-1/4 -top-12 justify-center items-center">
            <TouchableOpacity
              className="flex-1 w-full h-full rounded-lg bg-lightsecondary disabled:bg-commondisabled justify-center items-center"
              disabled={currentBet !== 0}
              onPress={() => addToBet(prevBet)}>
              <Text className="text-darktext font-bold">Rebet</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <View
          ref={betCircleRef}
          onLayout={measureBetCirclePosition}
          className="basis-1/3 bg-lightbg/40 h-3/4 aspect-square rounded-full p-2 justify-center items-center border-4 border-lightprimary border-dotted">
          <View className="w-full h-full aspect-square rounded-full p-2 justify-center items-center border-4 border-black/80 border-dotted">
            <Text className="absolute font-bold text-lighttext text-xl">$</Text>
            {currentBet > 0 && (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="w-full h-full justify-center items-center">
                <Image
                  resizeMode="contain"
                  className="w-full h-full justify-center items-center"
                  source={require('../../../../Assets/Images/coin.png')}
                />
                <Text className="absolute font-bold text-darktext text-xl">
                  {currentBet}
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
        {currentBet > 0 && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            className="h-1/3 w-1/4 bg-lightaccent rounded-lg justify-center items-center">
            <TouchableOpacity
              className="flex-1 justify-center items-center"
              onPress={handlePlay}>
              <Text className="text-darktext font-bold">Play</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      <View
        className="w-full h-1/3 flex-row flex-wrap gap-3 justify-center content-center"
        style={{height: screenWidth / 5}}>
        {betAmounts.map((amount: number) => {
          return (
            <ChipComponent
              key={`bet-${amount}`}
              amount={amount}
              betCirclePosition={betCirclePosition}
              coins={coins}
              onAddToBet={addToBet}
              delToBet={delToBet}
              currentBet={currentBet}
            />
          );
        })}
      </View>
    </Animated.View>
  );
};

export default React.memo(BetComponent);
