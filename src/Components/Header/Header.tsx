import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

import LottieView from 'lottie-react-native';

import {scale} from '../../Constants/Constants';
import coinStore from '../../Stores/coinStore';
import Icon from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProp} from '../../Navigation/Utils/NavigationTypes';
import {ThemeType, useThemeStore} from '../../Stores/themeStore';
import {Colors} from '../../Constants/Colors';

const screenHeight = Dimensions.get('screen').height;
const coinAnimationInterval = 3000;

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Game Carousel',
  showBackButton = false,
}) => {
  const coins = coinStore((state) => state.coins);
  const navigation = useNavigation<RootStackNavigationProp>();

  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('TabNavigation', {screen: 'Home'});
    }
  };

  return (
    <View
      className="flex-row top-0 w-full bg-lightbg dark:bg-darkbg justify-center items-center p-2"
      style={[
        styles.headerContainer,
        styles.shadow,
        {
          shadowColor: isDarkMode
            ? Colors.DarkTheme.Text
            : Colors.LightTheme.Text,
        },
      ]}>
      <View className="flex-row w-3/4 h-full">
        {showBackButton && (
          <TouchableOpacity
            className="h-full w-1/5 justify-center items-center"
            onPress={handleBackPress}>
            <Icon
              name="arrow-back"
              size={scale(36)}
              color={
                isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
              }
            />
          </TouchableOpacity>
        )}
        <View className="h-full grow w-4/5 justify-center items-center">
          <Text
            adjustsFontSizeToFit
            className=" text-2xl font-extrabold align-middle text-center text-lighttext dark:text-darktext">
            {title}
          </Text>
        </View>
      </View>
      <View className="flex-row h-full w-1/4 p-2 bg-lightsecondary/20 dark:bg-darksecondary/20 rounded-lg border-2 border-lightaccent dark:border-darkaccent">
        <View className="h-full w-1/3 justify-center items-center">
          <LottieView
            source={require('../../Assets/LottieJson/coin.json')}
            duration={coinAnimationInterval}
            style={styles.lottieCoin}
            loop
            autoPlay
          />
        </View>
        <View className="h-full w-2/3 justify-center items-center">
          <Text
            adjustsFontSizeToFit
            maxFontSizeMultiplier={0.9}
            className="text-lg font-bold align-middle text-center text-lighttext dark:text-darktext">
            {coins}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: screenHeight * 0.08,
  },
  lottieCoin: {
    width: scale(40),
    height: scale(40),
  },
  shadow: {
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default React.memo(Header);
