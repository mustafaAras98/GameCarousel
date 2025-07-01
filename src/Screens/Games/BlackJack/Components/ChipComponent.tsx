import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {Colors} from '../../../../Constants/Colors';
import {PositionObjectType} from '../../../../Constants/Constants';

interface ChipComponentI {
  currentBet: number;
  amount: number;
  coins: number;
  onAddToBet: (amount: number) => void;
  delToBet: (amount: number) => void;
  betCirclePosition: PositionObjectType;
}

const ChipComponent: React.FC<ChipComponentI> = ({
  currentBet,
  amount,
  coins,
  onAddToBet,
  delToBet,
  betCirclePosition,
}) => {
  const useChipGesture = () => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scaleChip = useSharedValue(1);

    const panGesture = Gesture.Pan()
      .onStart(() => {
        scaleChip.value = withTiming(1.2, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
      })
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      })
      .onEnd((event) => {
        const chipFinalX = event.absoluteX;
        const chipFinalY = event.absoluteY;

        const circleCenterX = betCirclePosition.x + betCirclePosition.width / 2;
        const circleCenterY =
          betCirclePosition.y + betCirclePosition.height / 2;

        const circleRadius = betCirclePosition.width / 2;

        const distance = Math.sqrt(
          Math.pow(chipFinalX - circleCenterX, 2) +
            Math.pow(chipFinalY - circleCenterY, 2)
        );

        const isInCircle = distance <= circleRadius;

        if (isInCircle && betCirclePosition.width > 0) {
          runOnJS(onAddToBet)(amount);
        }

        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scaleChip.value = withSpring(1);
      });

    const tapGesture = Gesture.Tap()
      .maxDistance(10)
      .onStart(() => {
        scaleChip.value = withSequence(
          withTiming(1.1, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(1, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          })
        );
        runOnJS(onAddToBet)(amount);
      });

    const composedChipGesture = Gesture.Simultaneous(panGesture, tapGesture);

    const chipAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scaleChip.value},
      ],
    }));

    return {composedChipGesture, chipAnimatedStyle};
  };

  const {composedChipGesture, chipAnimatedStyle} = useChipGesture();

  return (
    <Animated.View
      className="w-1/6 aspect-square p-1 rounded-full justify-center items-center"
      style={[
        {
          backgroundColor:
            currentBet + amount > coins
              ? Colors.Common.Disabled
              : Colors.LightTheme.Secondary,
        },
        styles.shadowContainer,
      ]}>
      {currentBet >= amount && (
        <TouchableOpacity
          className="bg-commonred absolute -right-1 -top-1 w-5 rounded-full justify-center items-center z-10"
          onPress={() => delToBet(amount)}>
          <Text className="text-sm font-semibold text-darktext">X</Text>
        </TouchableOpacity>
      )}
      <GestureDetector key={`bet-${amount}`} gesture={composedChipGesture}>
        <Animated.View
          className="bg-lightaccent rounded-full w-full h-full p-1 justify-center items-center"
          style={[chipAnimatedStyle]}>
          <Image
            resizeMode="contain"
            className="w-full h-full justify-center items-center"
            source={require('../../../../Assets/Images/coin.png')}
          />
          <Text className="absolute font-bold text-darktext text-xl ">
            {amount}
          </Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default React.memo(ChipComponent);

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: Colors.LightTheme.Accent,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
