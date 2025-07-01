import {RefObject, useCallback, useEffect, useRef} from 'react';
import {Card} from '../../../../Models/Cards/Cards';
import {calculateScore} from '../Utils/cardUtils';

import {
  ActiveHands,
  animationTiming,
  GameState,
  GameStates,
  HandState,
} from '../Constants/gameConstant';

import {ShuffledDeckRef} from '../Components/ShuffledDeck';

import {createDeck, shuffleDeck} from '../../../../Models/Cards/Cards';

import {useSoundManager, Sound} from './useSoundManager';

import coinStore from '../../../../Stores/coinStore';

export const useGameLogic = () => {
  const {playSound} = useSoundManager();
  const timeoutIds = useRef<NodeJS.Timeout[]>([]);
  const isMounted = useRef(true);
  const {addCoins, decreaseCoins} = coinStore();

  useEffect(() => {
    isMounted.current = true;
    const currentTimeoutIds = timeoutIds.current;
    return () => {
      isMounted.current = false;
      currentTimeoutIds.forEach((id) => clearTimeout(id));
    };
  }, []);

  const managedSetTimeout = useCallback(
    (callback: () => void, duration: number) => {
      const id = setTimeout(() => {
        timeoutIds.current = timeoutIds.current.filter(
          (timeoutId) => timeoutId !== id
        );
        callback();
      }, duration);
      timeoutIds.current.push(id);
    },
    []
  );
  const delay = (ms: number): Promise<void> =>
    new Promise((res) => setTimeout(res, ms));

  const handleGameResult = useCallback(
    (
      score: number,
      dealerScore: number,
      bet: number,
      shouldPlaySound?: boolean
    ): string => {
      let result = '';
      if (score > 21) {
        shouldPlaySound ? playSound(Sound.LOSE) : null;
        result = `Bust - Lost ${bet}`;
      } else if (dealerScore > 21 || score > dealerScore) {
        shouldPlaySound ? playSound(Sound.WIN) : null;
        addCoins(bet * 2);
        result = `Won +${bet}`;
      } else if (score === dealerScore) {
        shouldPlaySound ? playSound(Sound.DRAW) : null;
        addCoins(bet);
        result = 'Push ±0';
      } else {
        shouldPlaySound ? playSound(Sound.LOSE) : null;
        result = `Lost -${bet}`;
      }

      return result;
    },
    [addCoins, playSound]
  );

  const checkDeckEmpty = (deck: Card[]) => {
    if (deck.length === 0) {
      return true;
    }
    return false;
  };

  const addNewDeckToCurrentDeck = (
    deck: Card[],
    setDeck: React.Dispatch<React.SetStateAction<Card[]>>
  ): Card[] => {
    const newDeck = createDeck();
    const combinedDeck: Card[] = [...deck, ...newDeck];
    const shuffled = shuffleDeck(combinedDeck);
    setDeck(shuffled);
    return shuffled;
  };

  const dealerPlay = useCallback(
    async (
      dealerCards: Card[],
      playerScore: number,
      deck: Card[],
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      setGameResult: React.Dispatch<React.SetStateAction<string>>,
      currentBet: number,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>
    ) => {
      let newDealerCards = [...dealerCards];
      let newDeck = [...deck];
      let dealerScore = calculateScore(newDealerCards);

      await delay(animationTiming);
      if (!isMounted.current) {
        return;
      }
      setDealer((prev) => ({
        ...prev,
        score: dealerScore,
      }));

      if (dealerScore === 21) {
        await delay(animationTiming);
        if (!isMounted.current) {
          return;
        }

        const resultMessage = handleGameResult(
          playerScore,
          dealerScore,
          currentBet
        );
        setGameResult(resultMessage);
        setGameState(GameStates.FINISHED);
        return;
      }

      while (dealerScore < 17) {
        const newCard = newDeck.pop();
        if (!newCard) {
          break;
        }

        const rotation = shuffledDeckRef.current?.getTopCardRotation() ?? 0;

        newDealerCards.push(newCard);
        setDeck([...newDeck]);

        setDealer((prev) => ({
          ...prev,
          cards: newDealerCards,
          cardRotations: [...prev.cardRotations, rotation],
        }));

        playSound(Sound.FLIP);

        await delay(animationTiming);
        if (!isMounted.current) {
          return;
        }
        dealerScore = calculateScore(newDealerCards);
        setDealer((prev) => ({
          ...prev,
          score: dealerScore,
        }));

        if (checkDeckEmpty(newDeck)) {
          newDeck = addNewDeckToCurrentDeck(newDeck, setDeck);
          setDeck([...newDeck]);
        }
      }

      await delay(animationTiming);
      if (!isMounted.current) {
        return;
      }

      const resultMessage = handleGameResult(
        playerScore,
        dealerScore,
        currentBet
      );
      setGameResult(resultMessage);
      setGameState(GameStates.FINISHED);
    },
    [handleGameResult, playSound]
  );

  const dealInitialCards = useCallback(
    async (
      setIsDealing: React.Dispatch<React.SetStateAction<boolean>>,
      setPlayer: React.Dispatch<React.SetStateAction<HandState>>,
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      deck: Card[],
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>,
      showDealerSecondCard: boolean,
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      setShowDealerSecondCard: React.Dispatch<React.SetStateAction<boolean>>,
      setGameResult: React.Dispatch<React.SetStateAction<string>>,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      currentBet: number,
      setIsSplitable: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      setIsDealing(true);

      const playerCard1 = deck[deck.length - 1];
      const dealerCard1 = deck[deck.length - 2];
      const playerCard2 = deck[deck.length - 3];
      const dealerCard2 = deck[deck.length - 4];

      const drawSequence = [
        {
          card: playerCard1,
          setState: setPlayer,
          cardDelay: 0,
          isPlayer: true,
        },
        {
          card: dealerCard1,
          setState: setDealer,
          cardDelay: 1,
          isPlayer: false,
        },
        {
          card: playerCard2,
          setState: setPlayer,
          cardDelay: 2,
          isPlayer: true,
        },
        {
          card: dealerCard2,
          setState: setDealer,
          cardDelay: 3,
          isPlayer: false,
        },
      ];

      drawSequence.forEach(({card, setState, cardDelay, isPlayer}) => {
        managedSetTimeout(() => {
          const rotation = shuffledDeckRef.current?.getTopCardRotation() ?? 0;
          setState((prev) => {
            const newCards = [...prev.cards, card];
            const newRotations = [...prev.cardRotations, rotation];

            playSound(Sound.FLIP);

            let newScore: number;
            if (isPlayer) {
              newScore = calculateScore(newCards);
            } else {
              const visibleCards = newCards.filter(
                (_, index) => index === 0 || showDealerSecondCard
              );
              newScore = calculateScore(visibleCards);
            }

            return {
              cards: newCards,
              cardRotations: newRotations,
              score: newScore,
            };
          });
          setDeck((prev) => prev.slice(0, -1));
        }, cardDelay * animationTiming);
      });

      managedSetTimeout(() => {
        const calculatedPlayerScore = calculateScore([
          playerCard1,
          playerCard2,
        ]);

        if (calculatedPlayerScore === 21) {
          setShowDealerSecondCard(true);

          managedSetTimeout(() => {
            const calculatedDealerScore = calculateScore([
              dealerCard1,
              dealerCard2,
            ]);
            setDealer((prev) => ({
              ...prev,
              score: calculatedDealerScore,
            }));

            const resultMessage = handleGameResult(
              calculatedPlayerScore,
              calculatedDealerScore,
              currentBet
            );
            setGameResult(resultMessage);
            setGameState(GameStates.FINISHED);
          }, animationTiming);
        }
        if (playerCard1.rank === playerCard2.rank) {
          setIsSplitable(true);
        }
        setIsDealing(false);
      }, animationTiming * 4);
    },
    [managedSetTimeout, playSound, handleGameResult]
  );

  const hit = useCallback(
    async (
      deck: Card[],
      dealerCards: Card[],
      playerScore: number,
      setPlayer: React.Dispatch<React.SetStateAction<HandState>>,
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      currentBet: number,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>,
      setGameResult: React.Dispatch<React.SetStateAction<string>>,
      setShowDealerSecondCard: React.Dispatch<React.SetStateAction<boolean>>,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>
    ): Promise<void> => {
      if (checkDeckEmpty(deck)) {
        addNewDeckToCurrentDeck(deck, setDeck);
      }

      const newCard = deck[deck.length - 1];
      const rotation = shuffledDeckRef.current?.getTopCardRotation() ?? 0;
      managedSetTimeout(() => {
        setPlayer((prev) => {
          const newCards = [...prev.cards, newCard];
          const newRotations = [...prev.cardRotations, rotation];

          playSound(Sound.FLIP);

          managedSetTimeout(() => {
            const newScore = calculateScore(newCards);
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              score: newScore,
            }));

            if (newScore > 21) {
              setShowDealerSecondCard(true);
              const dealerFullScore = calculateScore(dealerCards);
              const resultMessage = handleGameResult(
                newScore,
                dealerFullScore,
                currentBet
              );
              setGameResult(resultMessage);

              managedSetTimeout(() => {
                setDealer((prevDealer) => ({
                  ...prevDealer,
                  score: dealerFullScore,
                }));
                setGameState(GameStates.FINISHED);
              }, 100);
            }
            if (newScore === 21) {
              setGameState(GameStates.DEALER);
              setShowDealerSecondCard(true);
              dealerPlay(
                dealerCards,
                playerScore,
                deck,
                setDeck,
                setDealer,
                setGameResult,
                currentBet,
                setGameState,
                shuffledDeckRef
              );
            }
          }, animationTiming);

          return {
            cards: newCards,
            cardRotations: newRotations,
            score: prev.score,
          };
        });
      }, 0);

      setDeck((prev: Card[]) => prev.slice(0, -1));
    },
    [dealerPlay, playSound, managedSetTimeout, handleGameResult]
  );

  const stand = useCallback(
    (
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      setShowDealerSecondCard: React.Dispatch<React.SetStateAction<boolean>>,
      dealerCards: Card[],
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      playerScore: number,
      deck: Card[],
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      setGameResult: React.Dispatch<React.SetStateAction<string>>,
      currentBet: number,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>
    ): void => {
      setGameState(GameStates.DEALER);
      setShowDealerSecondCard(true);
      managedSetTimeout(() => {
        dealerPlay(
          dealerCards,
          playerScore,
          deck,
          setDeck,
          setDealer,
          setGameResult,
          currentBet,
          setGameState,
          shuffledDeckRef
        );
      }, animationTiming);
    },
    [dealerPlay, managedSetTimeout]
  );

  const doubleDown = useCallback(
    async (
      deck: Card[],
      dealerCards: Card[],
      setPlayer: React.Dispatch<React.SetStateAction<HandState>>,
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      currentBet: number,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>,
      setGameResult: React.Dispatch<React.SetStateAction<string>>,
      setShowDealerSecondCard: React.Dispatch<React.SetStateAction<boolean>>,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      setCurrentBet: React.Dispatch<React.SetStateAction<number>>
    ): Promise<void> => {
      const newBet = currentBet * 2;
      decreaseCoins(currentBet);
      setCurrentBet(newBet);

      if (checkDeckEmpty(deck)) {
        addNewDeckToCurrentDeck(deck, setDeck);
      }

      const newCard = deck[deck.length - 1];
      const rotation = shuffledDeckRef.current?.getTopCardRotation() ?? 0;
      setDeck((prev: Card[]) => prev.slice(0, -1));

      playSound(Sound.FLIP);

      setPlayer((prev) => {
        const newCards = [...prev.cards, newCard];
        const newRotations = [...prev.cardRotations, rotation];
        const newScore = calculateScore(newCards);

        managedSetTimeout(() => {
          setPlayer((prevPlayer) => ({...prevPlayer, score: newScore}));

          if (newScore > 21) {
            setShowDealerSecondCard(true);
            const dealerFullScore = calculateScore(dealerCards);
            setDealer((prevDealer) => ({
              ...prevDealer,
              score: dealerFullScore,
            }));
            const resultMessage = handleGameResult(
              newScore,
              dealerFullScore,
              newBet
            );
            setGameResult(resultMessage);
            setGameState(GameStates.FINISHED);
          } else {
            setGameState(GameStates.DEALER);
            setShowDealerSecondCard(true);
            dealerPlay(
              dealerCards,
              newScore,
              deck,
              setDeck,
              setDealer,
              setGameResult,
              newBet,
              setGameState,
              shuffledDeckRef
            );
          }
        }, animationTiming);

        return {
          cards: newCards,
          cardRotations: newRotations,
          score: prev.score,
        };
      });
    },
    [decreaseCoins, playSound, managedSetTimeout, handleGameResult, dealerPlay]
  );

  const dealCardToHand = useCallback(
    (
      activeHand: ActiveHands,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>,
      setLeftHand: React.Dispatch<React.SetStateAction<HandState>>,
      setRightHand: React.Dispatch<React.SetStateAction<HandState>>,
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      callback?: () => void
    ) => {
      setDeck((currentDeck) => {
        const newCard = currentDeck[currentDeck.length - 1];
        const newDeck = currentDeck.slice(0, -1);

        managedSetTimeout(() => {
          const rotation = shuffledDeckRef.current?.getTopCardRotation() ?? 0;
          playSound(Sound.FLIP);
          if (activeHand === ActiveHands.Left) {
            setLeftHand((prev) => {
              const newCards = [...prev.cards, newCard];
              const newScore = calculateScore(newCards);
              return {
                cards: newCards,
                cardRotations: [...prev.cardRotations, rotation],
                score: newScore,
              };
            });
          } else {
            setRightHand((prev) => {
              const newCards = [...prev.cards, newCard];
              const newScore = calculateScore(newCards);
              return {
                cards: newCards,
                cardRotations: [...prev.cardRotations, rotation],
                score: newScore,
              };
            });
          }

          if (callback) {
            managedSetTimeout(callback, animationTiming);
          }
        }, 0);

        return newDeck;
      });
    },
    [managedSetTimeout, playSound]
  );

  const dealerPlaySplit = useCallback(
    async (
      dealerCards: Card[],
      leftHandScore: number,
      rightHandScore: number,
      deck: Card[],
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      currentBet: number,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      shuffledDeckRef: RefObject<any>,
      setSplitResults: React.Dispatch<
        React.SetStateAction<{left: string; right: string}>
      >
    ) => {
      let newDealerCards = [...dealerCards];
      let newDeck = [...deck];
      let dealerScore = calculateScore(newDealerCards);

      await delay(animationTiming);
      if (!isMounted.current) {
        return;
      }
      setDealer((prev) => ({
        ...prev,
        score: dealerScore,
      }));

      if (dealerScore === 21) {
        await delay(animationTiming);
        if (!isMounted.current) {
          return;
        }
        const leftResult = handleGameResult(
          leftHandScore,
          dealerScore,
          currentBet / 2,
          false
        );
        const rightResult = handleGameResult(
          rightHandScore,
          dealerScore,
          currentBet / 2,
          false
        );

        setSplitResults({
          left: leftResult,
          right: rightResult,
        });

        setGameState(GameStates.FINISHED);
        return;
      }
      while (dealerScore < 17) {
        const newCard = newDeck.pop();
        if (!newCard) {
          break;
        }

        const rotation = shuffledDeckRef.current?.getTopCardRotation() ?? 0;

        newDealerCards.push(newCard);
        setDeck([...newDeck]);

        setDealer((prev) => ({
          ...prev,
          cards: newDealerCards,
          cardRotations: [...prev.cardRotations, rotation],
        }));

        playSound(Sound.FLIP);

        await delay(animationTiming);
        if (!isMounted.current) {
          return;
        }
        dealerScore = calculateScore(newDealerCards);
        setDealer((prev) => ({
          ...prev,
          score: dealerScore,
        }));

        if (checkDeckEmpty(newDeck)) {
          newDeck = addNewDeckToCurrentDeck(newDeck, setDeck);
          setDeck([...newDeck]);
        }
      }

      await delay(animationTiming);
      if (!isMounted.current) {
        return;
      }

      const leftResult = handleGameResult(
        leftHandScore,
        dealerScore,
        currentBet / 2
      );
      const rightResult = handleGameResult(
        rightHandScore,
        dealerScore,
        currentBet / 2
      );

      setSplitResults({
        left: leftResult,
        right: rightResult,
      });

      setGameState(GameStates.FINISHED);
    },
    [handleGameResult, playSound]
  );

  const split = useCallback(
    async (
      player: {
        cards: Card[];
        cardRotations: number[];
        score: number;
      },
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>,
      isSplitable: boolean,
      setIsSplitable: React.Dispatch<React.SetStateAction<boolean>>,
      isSplit: boolean,
      setIsSplit: React.Dispatch<React.SetStateAction<boolean>>,
      currentBet: number,
      setCurrentBet: React.Dispatch<React.SetStateAction<number>>,
      setLeftHand: React.Dispatch<React.SetStateAction<HandState>>,
      setRightHand: React.Dispatch<React.SetStateAction<HandState>>,
      setActiveHand: React.Dispatch<React.SetStateAction<ActiveHands>>,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      setShowDealerSecondCard: React.Dispatch<React.SetStateAction<boolean>>,
      dealerCards: Card[],
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      deck: Card[],
      setIsDealing: React.Dispatch<React.SetStateAction<boolean>>,
      setSplitResults: React.Dispatch<
        React.SetStateAction<{left: string; right: string}>
      >
    ) => {
      if (player.cards.length === 2 && isSplitable && !isSplit) {
        setIsDealing(true);
        const firstCard = player.cards[0];
        const secondCard = player.cards[1];
        decreaseCoins(currentBet);
        setCurrentBet(currentBet * 2);

        playSound(Sound.FLIP);
        setLeftHand({
          cards: [firstCard],
          cardRotations: [player.cardRotations[0]],
          score: calculateScore([firstCard]),
        });

        setRightHand({
          cards: [secondCard],
          cardRotations: [player.cardRotations[1]],
          score: calculateScore([secondCard]),
        });

        setIsSplit(true);
        setActiveHand(ActiveHands.Left);
        setIsSplitable(false);

        managedSetTimeout(() => {
          dealCardToHand(
            ActiveHands.Left,
            shuffledDeckRef,
            setLeftHand,
            setRightHand,
            setDeck,
            () => {
              dealCardToHand(
                ActiveHands.Right,
                shuffledDeckRef,
                setLeftHand,
                setRightHand,
                setDeck,
                () => {
                  managedSetTimeout(() => {
                    setLeftHand((leftHandState) => {
                      setRightHand((rightHandState) => {
                        if (
                          leftHandState.score === 21 &&
                          rightHandState.score === 21
                        ) {
                          setShowDealerSecondCard(true);
                          dealerPlaySplit(
                            dealerCards,
                            leftHandState.score,
                            rightHandState.score,
                            deck,
                            setDeck,
                            setDealer,
                            currentBet,
                            setGameState,
                            shuffledDeckRef,
                            setSplitResults
                          );
                        } else if (leftHandState.score === 21) {
                          setActiveHand(ActiveHands.Right);
                        }
                        return rightHandState;
                      });
                      return leftHandState;
                    });
                    setIsDealing(false);
                  }, animationTiming);
                }
              );
            }
          );
        }, animationTiming * 2);
      }
    },
    [
      dealCardToHand,
      dealerPlaySplit,
      decreaseCoins,
      managedSetTimeout,
      playSound,
    ]
  );

  const hitSplitHand = useCallback(
    (
      leftHand: HandState,
      rightHand: HandState,
      activeHand: ActiveHands,
      setActiveHand: React.Dispatch<React.SetStateAction<ActiveHands>>,
      deck: Card[],
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>,
      setLeftHand: React.Dispatch<React.SetStateAction<HandState>>,
      setRightHand: React.Dispatch<React.SetStateAction<HandState>>,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      setShowDealerSecondCard: React.Dispatch<React.SetStateAction<boolean>>,
      dealerCards: Card[],
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      currentBet: number,
      setSplitResults: React.Dispatch<
        React.SetStateAction<{left: string; right: string}>
      >
    ) => {
      if (activeHand === ActiveHands.Left) {
        if (leftHand.score < 21) {
          dealCardToHand(
            activeHand,
            shuffledDeckRef,
            setLeftHand,
            setRightHand,
            setDeck,
            () => {
              setLeftHand((prev) => {
                if (prev.score === 21) {
                  managedSetTimeout(() => {
                    if (rightHand.score === 21) {
                      setShowDealerSecondCard(true);
                      dealerPlaySplit(
                        dealerCards,
                        prev.score,
                        rightHand.score,
                        deck,
                        setDeck,
                        setDealer,
                        currentBet,
                        setGameState,
                        shuffledDeckRef,
                        setSplitResults
                      );
                    } else {
                      setActiveHand(ActiveHands.Right);
                    }
                  }, animationTiming);
                } else if (prev.score > 21) {
                  managedSetTimeout(() => {
                    setActiveHand(ActiveHands.Right);
                  }, animationTiming);
                }
                return prev;
              });
            }
          );
        } else {
          managedSetTimeout(
            () => setActiveHand(ActiveHands.Right),
            animationTiming
          );
        }
      } else {
        if (rightHand.score < 21) {
          dealCardToHand(
            activeHand,
            shuffledDeckRef,
            setLeftHand,
            setRightHand,
            setDeck,
            () => {
              setRightHand((prev) => {
                if (prev.score >= 21) {
                  managedSetTimeout(() => {
                    setShowDealerSecondCard(true);
                    dealerPlaySplit(
                      dealerCards,
                      leftHand.score,
                      prev.score,
                      deck,
                      setDeck,
                      setDealer,
                      currentBet,
                      setGameState,
                      shuffledDeckRef,
                      setSplitResults
                    );
                  }, animationTiming);
                }
                return prev;
              });
            }
          );
        } else {
          managedSetTimeout(() => {
            setShowDealerSecondCard(true);
            dealerPlaySplit(
              dealerCards,
              leftHand.score,
              rightHand.score,
              deck,
              setDeck,
              setDealer,
              currentBet,
              setGameState,
              shuffledDeckRef,
              setSplitResults
            );
          }, animationTiming);
        }
      }
    },
    [dealCardToHand, dealerPlaySplit, managedSetTimeout]
  );

  const standSplitHand = useCallback(
    (
      leftHand: HandState,
      rightHand: HandState,
      activeHand: ActiveHands,
      setActiveHand: React.Dispatch<React.SetStateAction<ActiveHands>>,
      deck: Card[],
      setDeck: React.Dispatch<React.SetStateAction<Card[]>>,
      setGameState: React.Dispatch<React.SetStateAction<GameState>>,
      setShowDealerSecondCard: React.Dispatch<React.SetStateAction<boolean>>,
      dealerCards: Card[],
      setDealer: React.Dispatch<React.SetStateAction<HandState>>,
      currentBet: number,
      shuffledDeckRef: RefObject<ShuffledDeckRef | null>,
      setSplitResults: React.Dispatch<
        React.SetStateAction<{left: string; right: string}>
      >
    ) => {
      if (activeHand === ActiveHands.Left) {
        setActiveHand(ActiveHands.Right);
      } else {
        setShowDealerSecondCard(true);
        dealerPlaySplit(
          dealerCards,
          leftHand.score,
          rightHand.score,
          deck,
          setDeck,
          setDealer,
          currentBet,
          setGameState,
          shuffledDeckRef,
          setSplitResults
        );
      }
    },
    [dealerPlaySplit]
  );

  return {
    dealerPlay,
    dealInitialCards,
    hit,
    stand,
    doubleDown,
    split,
    hitSplitHand,
    standSplitHand,
    addNewDeckToCurrentDeck,
  };
};
