import React, {JSX, useState} from 'react';
import {
  View,
  Text,
  LayoutChangeEvent,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
} from 'react-native-reanimated';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Navigation/Utils/NavigationTypes';

import Icon from '@react-native-vector-icons/ionicons';
import IoniconsGlyph from 'react-native-vector-icons/dist/glyphmaps/Ionicons.json';
type IoniconsIconNames = typeof IoniconsGlyph;

interface CardInterface {
  title?: string;
  content: JSX.Element;
  buttonFunction: () => void;
  buttonIconName: keyof IoniconsIconNames;
  buttonLabel: string;
  opacity?: number;
}

const GameStatusCard: React.FC<CardInterface> = ({
  title = '',
  content,
  buttonFunction,
  buttonIconName,
  buttonLabel,
  opacity = 1,
}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setDimensions({width, height});
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleHomePress = () => {
    navigation.navigate('TabNavigation', {screen: 'Home'});
  };

  return (
    <View
      className="absolute gap-4 w-full h-1/2"
      style={[
        styles.elevation,
        {
          opacity: opacity,
        },
      ]}>
      <Animated.View
        onLayout={handleLayout}
        entering={FadeInDown.duration(500).easing(Easing.exp)}
        exiting={FadeOutDown.duration(100).easing(Easing.exp)}
        className="absolute gap-4 w-full h-full"
        accessibilityLabel={`${title} status card`}>
        {title !== '' && (
          <View className="flex-row w-full h-1/4 justify-center items-center">
            <View className="h-full">
              <View
                style={{
                  borderLeftWidth: dimensions.height * 0.25 * 0.5,
                  borderTopWidth: dimensions.height * 0.25 * 0.5,
                }}
                className="w-0 h-0 border-l-transparent border-t-blue-400"
              />
              <View
                style={{
                  borderLeftWidth: dimensions.height * 0.25 * 0.5,
                  borderBottomWidth: dimensions.height * 0.25 * 0.5,
                }}
                className="w-0 h-0 border-l-transparent border-b-blue-400"
              />
            </View>
            <View className="w-3/5 h-full bg-blue-500 justify-center items-center">
              <Text
                adjustsFontSizeToFit
                accessibilityRole="header"
                accessibilityLabel={title}
                className="text-2xl text-darktext font-semibold align-middle text-center">
                {title}
              </Text>
            </View>
            <View className="h-full">
              <View
                style={{
                  borderRightWidth: dimensions.height * 0.25 * 0.5,
                  borderTopWidth: dimensions.height * 0.25 * 0.5,
                }}
                className="w-0 h-0 border-r-transparent border-t-blue-400"
              />
              <View
                style={{
                  borderRightWidth: dimensions.height * 0.25 * 0.5,
                  borderBottomWidth: dimensions.height * 0.25 * 0.5,
                }}
                className="w-0 h-0 border-r-transparent border-b-blue-400"
              />
            </View>
          </View>
        )}
        <View className="w-full h-3/4 bg-blue-500 rounded-md justify-center items-center">
          <View className="flex-row w-full h-3/5 items-center justify-center gap-2">
            {content}
          </View>
          <View className="w-full h-2/5 flex-row items-center justify-around">
            <TouchableOpacity
              className="p-4 rounded-full bg-blue-400 justify-around items-center"
              accessibilityRole="button"
              accessibilityLabel={buttonLabel}
              accessibilityHint={`Tap this button to perform the ${buttonLabel} action`}
              onPress={buttonFunction}>
              <Icon size={24} name={buttonIconName} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 rounded-full bg-blue-400 justify-around items-center"
              onPress={handleHomePress}
              accessibilityRole="button"
              accessibilityLabel="Home"
              accessibilityHint="Tap to go to home page">
              <Icon size={24} name="home" color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  elevation: {
    zIndex: 100,
    elevation: 5,
  },
});
export default React.memo(GameStatusCard);
