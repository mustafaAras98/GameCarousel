import {NavigationProp, NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export type BottomTabParamList = {
  Rankings: undefined;
  Home: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  TabNavigation: NavigatorScreenParams<BottomTabParamList>;
  SnakeGameScreen: undefined;
  RockPaperScissorScreen: undefined;
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;
export type BottomTabNavigationProps =
  BottomTabNavigationProp<BottomTabParamList>;
