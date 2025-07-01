import {ImageSourcePropType} from 'react-native';
import cardImages from './CardImage';
import uuid from 'react-native-uuid';

export interface Card {
  id: string;
  name: string;
  suit: string;
  rank: string;
  imageName: string;
  imageSource: ImageSourcePropType;
  rotation?: number;
}

const SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const RANKS = [
  'Ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const suitFileName = suit.toLowerCase();
      const rankFileName = rank.toLowerCase();
      const imageNameKey = `${rankFileName}_of_${suitFileName}`;
      const card: Card = {
        id: uuid.v4() as string,
        name: `${suit} ${rank}`,
        suit: suit,
        rank: rank,
        imageName: imageNameKey,
        imageSource: cardImages[imageNameKey as keyof typeof cardImages],
      };

      deck.push(card);
    }
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffledDeck = [...deck];
  let currentIndex = shuffledDeck.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffledDeck[currentIndex], shuffledDeck[randomIndex]] = [
      shuffledDeck[randomIndex],
      shuffledDeck[currentIndex],
    ];
  }

  return shuffledDeck;
}
