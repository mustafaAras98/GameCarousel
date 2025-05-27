export interface IGame {
  gameName: string;
  gameId: string;
  startGame(navigation?: any): void;
  stopGame(): void;
}
