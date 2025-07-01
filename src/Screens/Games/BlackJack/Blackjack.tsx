import {
  View,
  ImageBackground,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {FadeInDown} from 'react-native-reanimated';

import {createDeck, shuffleDeck, Card} from '../../../Models/Cards/Cards';

import ShuffledDeck, {ShuffledDeckRef} from './Components/ShuffledDeck';
import GameStatusCard from '../../../Components/GameStatusCard';
import BetComponent from './Components/BetComponent';
import AnimatedCard from './Components/AnimatedCard';

import {PositionObjectType} from '../../../Constants/Constants';
import {
  animationTiming,
  GameStates,
  GameState,
  ActiveHands,
  HandState,
} from './Constants/gameConstant';

import {useGameLogic} from './Hooks/useGameLogic';

import coinStore from '../../../Stores/coinStore';
import SplitCards from './Components/SplitCards';
import {useLayoutHelpers} from '../../../Utils/HandleLayout';

const screenHeight = Dimensions.get('screen').height;
const initialPosition: PositionObjectType = {x: 0, y: 0, width: 0, height: 0};
const initialHandState: HandState = {cards: [], cardRotations: [], score: 0};

const Blackjack = () => {
  const {coins, decreaseCoins} = coinStore();
  const {
    addNewDeckToCurrentDeck,
    hit,
    stand,
    dealInitialCards,
    doubleDown,
    split,
    hitSplitHand,
    standSplitHand,
  } = useGameLogic();
  const {measureMultipleRefs, handleLayout} = useLayoutHelpers();

  const [deck, setDeck] = useState<Card[]>(shuffleDeck(createDeck()));

  const [gameState, setGameState] = useState<GameState>(GameStates.BETTING);
  const [gameResult, setGameResult] = useState<string>('');
  const [splitResults, setSplitResults] = useState<{
    left: string;
    right: string;
  }>({left: '', right: ''});
  const [currentBet, setCurrentBet] = useState<number>(0);
  const [prevBet, setPrevBet] = useState<number>(0);
  const [isDealing, setIsDealing] = useState<boolean>(true);
  const [showDealerSecondCard, setShowDealerSecondCard] =
    useState<boolean>(false);

  const [activeHand, setActiveHand] = useState<ActiveHands>(ActiveHands.Left);
  const [isSplitable, setIsSplitable] = useState<boolean>(false);
  const [isSplit, setIsSplit] = useState<boolean>(false);

  const [player, setPlayer] = useState<HandState>(initialHandState);
  const [dealer, setDealer] = useState<HandState>(initialHandState);
  const [leftHand, setLeftHand] = useState<HandState>(initialHandState);
  const [rightHand, setRightHand] = useState<HandState>(initialHandState);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const deckRef = useRef<View>(null);
  const playerCardsRef = useRef<View>(null);
  const dealerCardsRef = useRef<View>(null);
  const shuffledDeckRef = useRef<ShuffledDeckRef | null>(null);

  const [playerCardsPosition, setPlayerCardsPosition] =
    useState<PositionObjectType>(initialPosition);
  const [dealerCardsPosition, setDealerCardsPosition] =
    useState<PositionObjectType>(initialPosition);
  const [shuffledDeckPosition, setshuffledDeckPosition] =
    useState<PositionObjectType>(initialPosition);
  const [rightHandPosition, setRightHandPosition] =
    useState<PositionObjectType>(initialPosition);
  const [leftHandPosition, setLeftHandPosition] =
    useState<PositionObjectType>(initialPosition);

  const handlePressDisabled = () => {
    setIsButtonDisabled(true);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, animationTiming);
  };

  const addToBet = (amount: number) => {
    if (coins >= amount + currentBet) {
      setCurrentBet((prev) => prev + amount);
    }
  };

  const delToBet = (amount: number) => {
    if (currentBet >= amount) {
      setCurrentBet((prev) => prev - amount);
    }
  };

  const clearBet = () => {
    if (currentBet >= 0) {
      setCurrentBet(0);
    }
  };

  const resetGameState = useCallback(() => {
    setCurrentBet(0);
    setGameResult('');
    setSplitResults({left: '', right: ''});
    setGameState(GameStates.BETTING);
    setShowDealerSecondCard(false);

    setIsDealing(false);

    setIsSplitable(false);
    setIsSplit(false);
    setActiveHand(ActiveHands.Left);
    setPlayer(initialHandState);
    setDealer(initialHandState);
    setLeftHand(initialHandState);
    setRightHand(initialHandState);
  }, []);

  const checkAndRefillDeck = useCallback(() => {
    if (deck.length < 13) {
      requestAnimationFrame(() => {
        addNewDeckToCurrentDeck(deck, setDeck);
      });
    }
  }, [deck, addNewDeckToCurrentDeck]);

  useEffect(() => {
    checkAndRefillDeck();
  }, [checkAndRefillDeck, deck]);

  const resetGame = useCallback(() => {
    checkAndRefillDeck();
    resetGameState();
  }, [checkAndRefillDeck, resetGameState]);

  const initializePositions = useCallback(async () => {
    await measureMultipleRefs([
      {ref: playerCardsRef, setPosition: setPlayerCardsPosition},
      {ref: dealerCardsRef, setPosition: setDealerCardsPosition},
      {ref: deckRef, setPosition: setshuffledDeckPosition},
    ]);
  }, [measureMultipleRefs]);

  const handlePlay = useCallback(async () => {
    setGameResult('');
    setGameState(GameStates.PLAYING);
    setShowDealerSecondCard(false);
    decreaseCoins(currentBet);
    setPrevBet(currentBet);

    requestAnimationFrame(async () => {
      await initializePositions();

      dealInitialCards(
        setIsDealing,
        setPlayer,
        setDealer,
        deck,
        shuffledDeckRef,
        showDealerSecondCard,
        setDeck,
        setShowDealerSecondCard,
        setGameResult,
        setGameState,
        currentBet,
        setIsSplitable
      );
    });
  }, [
    currentBet,
    dealInitialCards,
    deck,
    decreaseCoins,
    initializePositions,
    showDealerSecondCard,
  ]);

  const handleHit = useCallback(async () => {
    handlePressDisabled();
    isSplit
      ? hitSplitHand(
          leftHand,
          rightHand,
          activeHand,
          setActiveHand,
          deck,
          setDeck,
          shuffledDeckRef,
          setLeftHand,
          setRightHand,
          setGameState,
          setShowDealerSecondCard,
          dealer.cards,
          setDealer,
          currentBet,
          setSplitResults
        )
      : (() => {
          hit(
            deck,
            dealer.cards,
            player.score,
            setPlayer,
            setDealer,
            currentBet,
            shuffledDeckRef,
            setGameResult,
            setShowDealerSecondCard,
            setGameState,
            setDeck
          );
          setIsSplitable(false);
          setIsSplit(false);
        })();
  }, [
    isSplit,
    leftHand,
    rightHand,
    activeHand,
    deck,
    dealer.cards,
    player.score,
    currentBet,
    hitSplitHand,
    hit,
  ]);
  const handleStand = useCallback(() => {
    handlePressDisabled();
    isSplit
      ? standSplitHand(
          leftHand,
          rightHand,
          activeHand,
          setActiveHand,
          deck,
          setDeck,
          setGameState,
          setShowDealerSecondCard,
          dealer.cards,
          setDealer,
          currentBet,
          shuffledDeckRef,
          setSplitResults
        )
      : stand(
          setGameState,
          setShowDealerSecondCard,
          dealer.cards,
          setDealer,
          player.score,
          deck,
          setDeck,
          setGameResult,
          currentBet,
          shuffledDeckRef
        );
  }, [
    activeHand,
    currentBet,
    dealer.cards,
    deck,
    isSplit,
    leftHand,
    player.score,
    rightHand,
    stand,
    standSplitHand,
  ]);
  const handleSplit = useCallback(() => {
    handlePressDisabled();
    split(
      player,
      setDeck,
      shuffledDeckRef,
      isSplitable,
      setIsSplitable,
      isSplit,
      setIsSplit,
      currentBet,
      setCurrentBet,
      setLeftHand,
      setRightHand,
      setActiveHand,
      setGameState,
      setShowDealerSecondCard,
      dealer.cards,
      setDealer,
      deck,
      setIsDealing,
      setSplitResults
    );
  }, [currentBet, dealer.cards, deck, isSplit, isSplitable, player, split]);
  const handleDoubleDown = useCallback(async () => {
    handlePressDisabled();
    doubleDown(
      deck,
      dealer.cards,
      setPlayer,
      setDealer,
      currentBet,
      shuffledDeckRef,
      setGameResult,
      setShowDealerSecondCard,
      setGameState,
      setDeck,
      setCurrentBet
    );
  }, [currentBet, dealer.cards, deck, doubleDown]);

  const betDisplay = useMemo(() => {
    if (gameState === 'betting') {
      return null;
    }

    return (
      <Animated.View
        entering={FadeInDown.duration(600).springify()}
        className="flex-row bg-lightbg/20 rounded-2xl w-1/2 h-1/2 px-2 border-2 border-lightsecondary/50 justify-center items-center">
        <Image
          className="w-1/3 aspect-square"
          resizeMode="contain"
          source={require('../../../Assets/Images/coin.png')}
        />
        <View className="w-2/3 h-full p-2 justify-center items-center">
          <Text
            adjustsFontSizeToFit
            maxFontSizeMultiplier={0.8}
            className="text-darktext font-bold text-lg align-middle">
            {currentBet}
          </Text>
        </View>
      </Animated.View>
    );
  }, [gameState, currentBet]);

  const dealerCards = useMemo(() => {
    return dealer.cards.map((card, index) => (
      <AnimatedCard
        key={`dealer-${index}-${card.id}`}
        card={card}
        index={index}
        initialRotate={dealer.cardRotations[index] ?? 0}
        shuffledDeckPosition={shuffledDeckPosition}
        targetPosition={dealerCardsPosition}
        animationTime={animationTiming}
        isHidden={!showDealerSecondCard && index === 1}
      />
    ));
  }, [
    dealer.cards,
    dealer.cardRotations,
    shuffledDeckPosition,
    dealerCardsPosition,
    showDealerSecondCard,
  ]);

  const playerCards = useMemo(() => {
    return player.cards.map((card, index) => (
      <AnimatedCard
        key={`player-${index}-${card.id}`}
        card={card}
        index={index}
        initialRotate={player.cardRotations[index] ?? 0}
        shuffledDeckPosition={shuffledDeckPosition}
        targetPosition={playerCardsPosition}
        animationTime={animationTiming}
      />
    ));
  }, [
    player.cards,
    player.cardRotations,
    shuffledDeckPosition,
    playerCardsPosition,
  ]);

  const gameResultContent = () => {
    if (isSplit && splitResults.left && splitResults.right) {
      return (
        <View className="flex-row items-center justify-center gap-4">
          <View className="w-1/2 items-center">
            <Text className="text-lg text-darktext font-semibold">
              Left Hand
            </Text>
            <Text className="text-xl text-darktext font-bold">
              {splitResults.left}
            </Text>
          </View>
          <View className="w-1/2 items-center">
            <Text className="text-lg text-darktext font-semibold">
              Right Hand
            </Text>
            <Text className="text-xl text-darktext font-bold">
              {splitResults.right}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View className="absolute pointer-events-none justify-center items-center">
        <Text className="text-3xl text-darktext font-bold">{gameResult}</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <ImageBackground
        className="flex-1"
        resizeMode="cover"
        source={require('./Assets/Image/backgroundimage.jpg')}>
        <View className="flex-row justify-between items-center w-full h-1/6 px-4 top-4">
          <View className="flex-row w-2/3 h-full justify-center items-center">
            {betDisplay}
            <Image
              className="w-1/2 aspect-square"
              resizeMode="contain"
              source={require('./Assets/Image/card_dealer.png')}
            />
          </View>
          <View
            ref={deckRef}
            onLayout={() => handleLayout(deckRef, setshuffledDeckPosition)}
            className="h-full w-1/3 justify-center items-center"
            style={{height: screenHeight / 6}}>
            <ShuffledDeck deckRef={shuffledDeckRef} deck={deck} />
          </View>
        </View>
        {gameState !== 'betting' && (
          <View className="h-4/6 w-full">
            <View
              ref={dealerCardsRef}
              onLayout={() =>
                handleLayout(dealerCardsRef, setDealerCardsPosition)
              }
              className="h-1/2 w-full flex-row">
              {dealerCards}
              <View className="absolute bottom-0 w-full h-1/6 items-center justify-center ">
                <Text className="text-xl text-darktext font-bold">
                  Dealer's Score: {dealer.score}
                </Text>
              </View>
            </View>
            {isSplit ? (
              <SplitCards
                activeHand={activeHand}
                shuffledDeckPosition={shuffledDeckPosition}
                leftHand={{
                  ...leftHand,
                  position: leftHandPosition,
                  setPosition: setLeftHandPosition,
                }}
                rightHand={{
                  ...rightHand,
                  position: rightHandPosition,
                  setPosition: setRightHandPosition,
                }}
              />
            ) : (
              <View
                ref={playerCardsRef}
                onLayout={() =>
                  handleLayout(playerCardsRef, setPlayerCardsPosition)
                }
                className="h-1/2 w-full flex-row">
                {playerCards}
                <View className="absolute bottom-0 w-full h-1/6 items-center justify-center ">
                  <Text className="text-xl text-darktext font-bold">
                    Player's Score: {player.score}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        {gameState === 'playing' && (
          <View className="flex-row w-full h-1/6 gap-4 justify-around items-center">
            <TouchableOpacity
              disabled={isDealing || isButtonDisabled}
              onPress={handleHit}
              className="h-2/3 w-1/4 bg-lightsecondary/30 rounded-2xl disabled:bg-commondisabled px-2 border-4 border-lightsecondary/50 justify-center items-center">
              <Text className="text-xl text-darktext font-bold align-middle text-center">
                {isSplit
                  ? `Hit ${activeHand === ActiveHands.Left ? 'Left' : 'Right'}`
                  : 'Hit'}
              </Text>
            </TouchableOpacity>
            {player.cards.length === 2 &&
              coins >= currentBet &&
              !isSplitable &&
              !isSplit && (
                <TouchableOpacity
                  className="h-2/3 w-1/4 bg-lightsecondary/30 rounded-2xl disabled:bg-commondisabled px-2 border-4 border-lightsecondary/50 justify-center items-center"
                  disabled={isDealing || isButtonDisabled}
                  onPress={handleDoubleDown}>
                  <Text className="text-xl text-darktext font-bold align-middle text-center">
                    Double Down
                  </Text>
                </TouchableOpacity>
              )}
            {isSplitable && !isSplit && (
              <TouchableOpacity
                className="h-2/3 w-1/4 bg-lightsecondary/30 rounded-2xl disabled:bg-commondisabled px-2 border-4 border-lightsecondary/50 justify-center items-center"
                onPress={handleSplit}
                disabled={!isSplitable}>
                <Text className="text-xl text-darktext font-bold align-middle text-center">
                  Split
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={isDealing || isButtonDisabled}
              onPress={handleStand}
              className="h-2/3 w-1/4 bg-lightsecondary/30 rounded-2xl disabled:bg-commondisabled px-2 border-4 border-lightsecondary/50 justify-center items-center">
              <Text className="text-xl text-darktext font-bold align-middle text-center">
                {isSplit
                  ? `Stand ${
                      activeHand === ActiveHands.Left ? 'Left' : 'Right'
                    }`
                  : 'Stand'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {gameState === 'betting' && (
          <BetComponent
            addToBet={addToBet}
            delToBet={delToBet}
            clearBet={clearBet}
            currentBet={currentBet}
            prevBet={prevBet}
            handlePlay={handlePlay}
          />
        )}
        {gameState === 'finished' && (
          <View className="flex-1 absolute w-full h-2/3 justify-end px-8 items-center">
            <GameStatusCard
              content={gameResultContent()}
              buttonIconName="refresh"
              buttonFunction={resetGame}
              buttonLabel="Refresh"
              opacity={0.9}
            />
          </View>
        )}
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

export default React.memo(Blackjack);
