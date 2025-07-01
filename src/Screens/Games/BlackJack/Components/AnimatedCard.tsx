import React, {useEffect, useMemo} from 'react';
import {Image, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';

import {Card} from '../../../../Models/Cards/Cards';
import cardImages from '../../../../Models/Cards/CardImage';

import {PositionObjectType, scale} from '../../../../Constants/Constants';
import {ActiveHands} from '../Constants/gameConstant';

type AnimatedCardProps = {
  card: Card;
  index: number;
  shuffledDeckPosition: PositionObjectType;
  targetPosition: PositionObjectType;
  initialRotate: number;
  animationTime: number;
  isHidden?: boolean;
  isSplit?: boolean;
  activeHand?: ActiveHands;
};

const cardWidth = scale(80);
const cardHeight = scale(120);
const splitScale = 0.8;
const overlapRatio = {
  normal: 0.725,
  split: 0.8,
};

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  card,
  index,
  shuffledDeckPosition,
  targetPosition,
  initialRotate,
  animationTime,
  isHidden = false,
  isSplit = false,
  activeHand = ActiveHands.Left,
}) => {
  const progress = useSharedValue(0);
  const splitProgress = useSharedValue(isSplit ? 1 : 0);

  const {startX, endX, startY, endY, imageSource} = useMemo(() => {
    const cardOverlapRatio = isSplit ? overlapRatio.split : overlapRatio.normal;
    const hiddenOffset = index * cardWidth * cardOverlapRatio;

    const baseX =
      shuffledDeckPosition.x + (shuffledDeckPosition.width - cardWidth) / 2;

    let calculatedStartX = 0;
    if (!isSplit) {
      calculatedStartX = baseX - index * cardWidth;
    } else {
      if (activeHand === ActiveHands.Left) {
        calculatedStartX = baseX - index * cardWidth;
      } else {
        calculatedStartX =
          shuffledDeckPosition.x -
          targetPosition.width +
          (shuffledDeckPosition.width - cardWidth) / 2 -
          index * cardWidth;
      }
    }

    let calculatedEndX = 0;
    if (!isSplit) {
      calculatedEndX =
        targetPosition.x + (cardWidth * splitScale) / 2 - hiddenOffset;
    } else {
      if (index <= 4) {
        calculatedEndX = targetPosition.x - hiddenOffset;
      } else {
        const bottomRowIndex = index + 1;
        const bottomRowOffset = bottomRowIndex * cardWidth * cardOverlapRatio;
        calculatedEndX = targetPosition.x - bottomRowOffset;
      }
    }

    const calculatedStartY =
      shuffledDeckPosition.y -
      targetPosition.y +
      (shuffledDeckPosition.height - cardHeight) / 2;

    let calculatedEndY = 0;
    if (!isSplit) {
      calculatedEndY = targetPosition.height / 2 - cardHeight / 2;
    } else {
      if (index <= 4) {
        calculatedEndY = targetPosition.height / 2 - cardHeight;
      } else {
        calculatedEndY = targetPosition.height / 2 - cardHeight / 2;
      }
    }

    const calculatedImageSource = isHidden
      ? cardImages.card_back
      : card.imageSource;

    return {
      startX: calculatedStartX,
      endX: calculatedEndX,
      startY: calculatedStartY,
      endY: calculatedEndY,
      imageSource: calculatedImageSource,
    };
  }, [
    isSplit,
    activeHand,
    index,
    shuffledDeckPosition,
    targetPosition,
    isHidden,
    card.imageSource,
  ]);

  useEffect(() => {
    progress.value = withTiming(1, {duration: animationTime});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationTime]);

  useEffect(() => {
    splitProgress.value = withTiming(isSplit ? 1 : 0, {
      duration: animationTime,
      easing: Easing.exp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSplit, animationTime]);

  const flipProgress = useDerivedValue(() =>
    withTiming(isHidden ? 0 : 1, {
      duration: animationTime,
      easing: Easing.out(Easing.ease),
    })
  );

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [startX, endX],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      progress.value,
      [0, 1],
      [startY, endY],
      Extrapolation.CLAMP
    );

    const rotation = interpolate(
      progress.value,
      [0, 0.3, 1],
      [initialRotate, initialRotate * 0.5, 0],
      Extrapolation.CLAMP
    );

    const progressRotateY = interpolate(progress.value, [0, 1], [0, 180]);
    const flipRotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);

    const rotateY = `${progressRotateY + flipRotateY}deg`;

    const scaleValue = interpolate(
      splitProgress.value,
      [0, 0.7, 1],
      [1, 0.96, splitScale],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {translateX},
        {translateY},
        {rotate: `${rotation}deg`},
        {rotateY},
        {scale: scaleValue},
      ],
    } as ViewStyle;
  });

  const cardSizeStyle = useMemo(
    () => ({
      width: cardWidth,
      height: cardHeight,
    }),
    []
  );

  return (
    <Animated.View style={[animatedStyle, styles.cardElevation]}>
      <Image resizeMode="contain" source={imageSource} style={cardSizeStyle} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardElevation: {
    zIndex: 65,
    pointerEvents: 'none',
    elevation: 1,
  },
});
export default React.memo(AnimatedCard);
