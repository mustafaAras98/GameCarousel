import {Text, View} from 'react-native';
import React from 'react';
import ThemeSwitch from '../../Components/ThemeSwitch';
import {scale, scaledPadding} from '../../Constants/Constants';
import SwipeableTabWrapper from '../../Navigation/Utils/SwipeableTabWrapper';

const Settings = () => {
  return (
    <SwipeableTabWrapper>
      <View className="flex-1 bg-lightbg dark:bg-darkbg">
        <View
          style={{margin: scaledPadding.large}}
          className="flex-row justify-start items-center">
          <View style={{marginRight: scaledPadding.medium}}>
            <Text className="text-lg font-bold align-middle text-center text-lighttext dark:text-darktext">
              Koyu Tema:
            </Text>
          </View>
          <View
            className="justify-center items-center"
            style={{height: scale(48), width: scale(136)}}>
            <ThemeSwitch />
          </View>
        </View>
      </View>
    </SwipeableTabWrapper>
  );
};

export default React.memo(Settings);
