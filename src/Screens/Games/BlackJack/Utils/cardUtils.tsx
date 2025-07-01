import {Card} from '../../../../Models/Cards/Cards';

const getCardValue = (card: Card): number => {
  const name = card.name.toLowerCase();

  if (
    name.includes('jack') ||
    name.includes('queen') ||
    name.includes('king')
  ) {
    return 10;
  }

  if (name.includes('ace')) {
    return 11;
  }

  const rank = name.split(' ')[1];
  const number = parseInt(rank, 10);
  return isNaN(number) ? 0 : number;
};

export const calculateScore = (cards: Card[]): number => {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    const value = getCardValue(card);
    score += value;
    if (value === 11) {
      aces++;
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
};
