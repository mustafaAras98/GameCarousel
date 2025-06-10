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
export class RockPaperScissorGame implements IGame {
  gameName = 'RockPaperScissor';
  gameId = 'rockpaperscissor';

  startGame(navigation: GameNavigationProp): void {
    navigation.navigate('RockPaperScissorScreen');
  }

  stopGame(): void {
    console.log(`${this.gameName} stopped.`);
  }
}
export class MathQuizGame implements IGame {
  gameName = 'MathQuiz';
  gameId = 'mathquiz';

  startGame(navigation: GameNavigationProp): void {
    navigation.navigate('MathQuizScreen');
  }

  stopGame(): void {
    console.log(`${this.gameName} stopped.`);
  }
}
export class BlackJackGame implements IGame {
  gameName = 'BlackJack';
  gameId = 'blackjack';

  startGame(navigation: GameNavigationProp): void {
    navigation.navigate('BlackJackScreen');
  }

  stopGame(): void {
    console.log(`${this.gameName} stopped.`);
  }
}
