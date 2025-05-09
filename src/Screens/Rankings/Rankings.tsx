import {View, Text} from 'react-native';
import React from 'react';

const Rankings = () => {
  return (
    <View className="flex-1 bg-lightbg dark:bg-darkbg">
      <Text className="text-3xl font-bold align-middle text-center text-lighttext dark:text-darktext">
        Rankings
      </Text>
    </View>
  );
};

export default React.memo(Rankings);
