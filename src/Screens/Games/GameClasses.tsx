import {RootStackParamList} from '../../Navigation/Utils/NavigationTypes';
import {IGame} from './GameInterface';
import {NavigationProp} from '@react-navigation/native';

type GameNavigationProp = NavigationProp<RootStackParamList>;

export class SnakeGame implements IGame {
  gameName = 'Snake';
  gameId = 'snake';

  startGame(navigation: GameNavigationProp): void {
    navigation.navigate('SnakeGameScreen');
  }

  stopGame(): void {
    console.log(`${this.gameName} stopped.`);
  }
}
