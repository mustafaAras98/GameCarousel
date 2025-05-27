import React from 'react';
import {View} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import useSwipeGesture from './useSwipeGesture';

interface SwipeableTabWrapperProps {
  children: React.ReactNode;
}

const SwipeableTabWrapper: React.FC<SwipeableTabWrapperProps> = ({
  children,
}) => {
  const panGesture = useSwipeGesture();

  return (
    <GestureDetector gesture={panGesture}>
      <View className="flex-1">{children}</View>
    </GestureDetector>
  );
};

export default React.memo(SwipeableTabWrapper);
