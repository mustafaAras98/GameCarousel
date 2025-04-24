import {View, Text, StyleSheet, LayoutChangeEvent} from 'react-native';
import React, {useState} from 'react';

export enum PositionType {
  Left,
  Right,
  Bottom,
  Top,
}

interface TooltipProps {
  x: number;
  y: number;
  height: number;
  width: number;
  context: string;
  position: PositionType;
}

const Tooltip: React.FC<TooltipProps> = ({
  x,
  y,
  height,
  width,
  context,
  position,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipSize, setTooltipSize] = useState({
    width: 0,
    height: 0,
  });

  const targetCenterX = x + width / 2;
  const targetCenterY = y + height / 2;

  const tooltipCenterX = tooltipSize.width / 2;
  const tooltipCenterY = tooltipSize.height / 2;

  const getPositionStyle = () => {
    const marginFromObject = 8;

    switch (position) {
      case PositionType.Left:
        return {
          top: targetCenterY - tooltipCenterY,
          left: x - tooltipSize.width - marginFromObject,
        };
      case PositionType.Right:
        return {
          top: targetCenterY - tooltipCenterY,
          left: x + width + marginFromObject,
        };
      case PositionType.Top:
        return {
          top: y - tooltipSize.height - marginFromObject,
          left: targetCenterX - tooltipCenterX,
        };
      case PositionType.Bottom:
        return {
          top: y + height + marginFromObject,
          left: targetCenterX - tooltipCenterX,
        };
      default:
        return {
          top: y,
          left: x,
        };
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const layoutWidth = event.nativeEvent.layout.width;
    const layoutHeight = event.nativeEvent.layout.height;

    setTooltipSize({
      width: layoutWidth,
      height: layoutHeight,
    });
    setIsVisible(true);
  };

  return (
    <View
      onLayout={handleLayout}
      className="absolute p-4 h-auto rounded-lg bg-red-400 z-999"
      style={[
        styles.tooltipContainer,
        isVisible ? getPositionStyle() : styles.opacityZero,
      ]}>
      <Text className="text-base text-darktext">{context}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 10,
  },
  opacityZero: {
    opacity: 0,
  },
});

export default React.memo(Tooltip);
