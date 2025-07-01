import {View, Text} from 'react-native';
import React, {useRef} from 'react';

import AnimatedCard from './AnimatedCard';

import {Card} from '../../../../Models/Cards/Cards';

import {animationTiming, ActiveHands} from '../Constants/gameConstant';
import {PositionObjectType} from '../../../../Constants/Constants';

import {useLayoutHelpers} from '../../../../Utils/HandleLayout';

interface SplitCardsI {
  activeHand: ActiveHands;
  shuffledDeckPosition: PositionObjectType;
  leftHand: {
    cards: Card[];
    cardRotations: number[];
    position: PositionObjectType;
    score: number;
    setPosition: React.Dispatch<React.SetStateAction<PositionObjectType>>;
  };
  rightHand: {
    cards: Card[];
    cardRotations: number[];
    position: PositionObjectType;
    score: number;
    setPosition: React.Dispatch<React.SetStateAction<PositionObjectType>>;
  };
}

const SplitCards: React.FC<SplitCardsI> = ({
  activeHand,
  shuffledDeckPosition,
  leftHand,
  rightHand,
}) => {
  const leftHandRef = useRef<View>(null);
  const rightHandRef = useRef<View>(null);

  const {handleLayout} = useLayoutHelpers();

  return (
    <View className="h-1/2 w-full flex-row">
      <View
        onLayout={() => handleLayout(leftHandRef, leftHand.setPosition)}
        ref={leftHandRef}
        className="w-1/2 h-full relative">
        <View
          className={`absolute inset-0 ${
            activeHand === ActiveHands.Left ? 'border-2 border-yellow-400' : ''
          } rounded-lg`}>
          <View className="h-full flex-row">
            {leftHand.cards.map((card, index) => (
              <AnimatedCard
                key={`left-${index}${card.id}`}
                card={card}
                index={index}
                initialRotate={leftHand.cardRotations[index] ?? 0}
                shuffledDeckPosition={shuffledDeckPosition}
                targetPosition={leftHand.position}
                animationTime={animationTiming}
                activeHand={ActiveHands.Left}
                isSplit={true}
              />
            ))}
          </View>
          <View className="absolute bottom-0 w-full h-1/6 items-center justify-center">
            <Text className="text-lg text-darktext font-bold">
              Left Hand: {leftHand.score}
            </Text>
          </View>
        </View>
      </View>
      <View
        onLayout={() => handleLayout(rightHandRef, rightHand.setPosition)}
        ref={rightHandRef}
        className="w-1/2 h-full relative">
        <View
          className={`absolute inset-0 ${
            activeHand === ActiveHands.Right ? 'border-2 border-yellow-400' : ''
          } rounded-lg`}>
          <View className="h-full flex-row">
            {rightHand.cards.map((card, index) => (
              <AnimatedCard
                key={`right-${index}${card.id}`}
                card={card}
                index={index}
                initialRotate={rightHand.cardRotations[index] ?? 0}
                shuffledDeckPosition={shuffledDeckPosition}
                targetPosition={{
                  ...rightHand.position,
                  x: rightHand.position.x - leftHand.position.width,
                }}
                animationTime={animationTiming}
                activeHand={ActiveHands.Right}
                isSplit={true}
              />
            ))}
          </View>
          <View className="absolute bottom-0 w-full h-1/6 items-center justify-center">
            <Text className="text-lg text-darktext font-bold">
              Right Hand: {rightHand.score}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(SplitCards);
