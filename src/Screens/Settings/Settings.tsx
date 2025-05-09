import {Text, View} from 'react-native';
import React from 'react';
import ThemeSwitch from '../../Components/ThemeSwitch';
import {scale, scaledPadding} from '../../Constants/Constants';

const Settings = () => {
  return (
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
          style={{height: scale(60), width: scale(160)}}>
          <ThemeSwitch />
        </View>
      </View>
    </View>
  );
};

export default React.memo(Settings);
