import {View, Text} from 'react-native';
import React from 'react';
import SwipeableTabWrapper from '../../Navigation/Utils/SwipeableTabWrapper';

const Rankings = () => {
  return (
    <SwipeableTabWrapper>
      <View className="flex-1 bg-lightbg dark:bg-darkbg">
        <Text className="text-3xl font-bold align-middle text-center text-lighttext dark:text-darktext">
          Rankings
        </Text>
      </View>
    </SwipeableTabWrapper>
  );
};

export default React.memo(Rankings);
