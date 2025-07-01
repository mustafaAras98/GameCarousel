import {Card} from '../../../../Models/Cards/Cards';

export const animationTiming = 600;

export const GameStates = {
  BETTING: 'betting',
  PLAYING: 'playing',
  DEALER: 'dealer',
  FINISHED: 'finished',
};

export enum ActiveHands {
  Left = 'left',
  Right = 'right',
}

export interface HandState {
  cards: Card[];
  cardRotations: number[];
  score: number;
}

export type GameState = (typeof GameStates)[keyof typeof GameStates];
