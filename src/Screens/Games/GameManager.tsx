// gameManager.ts
import {IGame} from './GameInterface';
import {MathQuizGame, RockPaperScissorGame, SnakeGame} from './GameClasses';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../Navigation/Utils/NavigationTypes';

type GameNavigationProp = NavigationProp<RootStackParamList>;

class GameManager {
  private games: Map<string, IGame> = new Map();

  constructor() {
    this.games.set('snake', new SnakeGame());
    this.games.set('rockpaperscissor', new RockPaperScissorGame());
    this.games.set('mathquiz', new MathQuizGame());
  }

  startGameFromId(gameId: string, navigation: GameNavigationProp): void {
    const selectedGame = this.games.get(gameId);
    if (selectedGame) {
      selectedGame.startGame(navigation);
    } else {
      console.warn(
        `The game with ID "${gameId}" was not found in the list of playable games.`
      );
    }
  }
}

export const gameManager = new GameManager();
