import {Image, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {Card} from '../../../../Models/Cards/Cards';
import cardImages from '../../../../Models/Cards/CardImage';

import {scale} from '../../../../Constants/Constants';

export interface ShuffledDeckRef {
  getTopCardRotation: () => number;
  getTopCard: () => Card | undefined;
}

type ShuffledDeckProps = {
  deck: Card[];
  deckRef?: React.RefObject<ShuffledDeckRef | null>;
};

const ShuffledDeckCard: React.FC<{
  index: number;
  rotation: number;
}> = ({index, rotation}) => {
  const rotateZ = useSharedValue(rotation);

  useEffect(() => {
    rotateZ.value = rotation;
  }, [rotation, rotateZ]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{rotate: `${rotateZ.value}deg`}],
    zIndex: index,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        resizeMode="contain"
        source={cardImages.card_back}
        style={{width: scale(80), height: scale(120)}}
      />
    </Animated.View>
  );
};

const ShuffledDeck: React.FC<ShuffledDeckProps> = ({deck, deckRef}) => {
  const cardRotations = useMemo(() => {
    const rotationMap = new Map<string, number>();
    deck.forEach((card) => {
      rotationMap.set(card.id, Math.random() * 20 - 20);
    });
    return rotationMap;
  }, [deck]);

  useEffect(() => {
    if (deckRef) {
      deckRef.current = {
        getTopCardRotation: () => {
          const topCard = deck[deck.length - 1];
          return cardRotations.get(topCard.id) ?? 0;
        },
        getTopCard: () => deck[deck.length - 1],
      };
    }
  }, [deckRef, deck, cardRotations]);

  return (
    <View className="w-full h-full justify-center items-center">
      {deck.map((card, index) => {
        const rotation = cardRotations.get(card.id) ?? 0;
        return (
          <ShuffledDeckCard key={card.id} index={index} rotation={rotation} />
        );
      })}
    </View>
  );
};

export default React.memo(ShuffledDeck);
