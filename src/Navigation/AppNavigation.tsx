import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Header from '../Components/Header';

import Snake from '../Screens/Games/Snake';
import RockPaperScissor from '../Screens/Games/RockPaperScissor';
import MathQuiz from '../Screens/Games/MathQuiz';
import Blackjack from '../Screens/Games/BlackJack';

import TabNavigation from './TabNavigation';
import {RootStackParamList} from './Utils/NavigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TabNavigation"
        screenOptions={{
          gestureEnabled: true,
          // eslint-disable-next-line react/no-unstable-nested-components
          header: ({route, options}) => {
            const showBackButton = route.name !== 'TabNavigation';
            const title = options?.title ?? route.name ?? 'Game';

            return <Header showBackButton={showBackButton} title={title} />;
          },
        }}>
        <Stack.Screen
          options={{title: 'Game Carousel'}}
          name="TabNavigation"
          component={TabNavigation}
        />
        <Stack.Group>
          <Stack.Screen
            name="SnakeGameScreen"
            component={Snake}
            options={{
              title: 'Snake',
            }}
          />
          <Stack.Screen
            name="RockPaperScissorScreen"
            component={RockPaperScissor}
            options={{
              title: 'Rock Paper Scissor',
            }}
          />
          <Stack.Screen
            name="MathQuizScreen"
            component={MathQuiz}
            options={{
              title: 'Math Quiz',
            }}
          />
          <Stack.Screen
            name="BlackJackScreen"
            component={Blackjack}
            options={{
              title: 'BlackJack',
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default React.memo(AppNavigation);
