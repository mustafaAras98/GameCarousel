import React, {
  useState,
  useEffect,
  useRef,
  JSX,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Vibration,
  Text,
  NativeModules,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Icon from '@react-native-vector-icons/ionicons';

import {Colors} from '../../../Constants/Colors';
import {games} from '../../../Models/Games';

import GameStatusCard from '../../../Components/GameStatusCard/GameStatusCard';
import Bottomsheet from './Component/Bottomsheet';

import {ThemeType, useThemeStore} from '../../../Stores/themeStore';
import scoreStore from '../../../Stores/scoreStore';
import coinStore from '../../../Stores/coinStore';
import {
  bestScorePointMultiplier,
  winPointMultiplier,
} from '../../../Constants/Constants';

interface Position {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

type DirectionName = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

const DIRECTIONS: Record<DirectionName, Direction> = {
  UP: {x: 0, y: -1},
  RIGHT: {x: 1, y: 0},
  DOWN: {x: 0, y: 1},
  LEFT: {x: -1, y: 0},
};

const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
const {SoundModule} = NativeModules;
const gameId = games[0].id;

const DEFAULT_GAME_SPEED = 40;
const DEFAULT_GRID_SIZE_COL = 12;
const DEFAULT_GRID_SIZE_ROW = 16;
const INITIAL_DIRECTION = DIRECTIONS.RIGHT;

export default function SnakeGame(): JSX.Element {
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const [food, setFood] = useState<Position>({x: 5, y: 5});
  const [score, setScore] = useState<number>(0);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const headRotation = useSharedValue('0deg');
  const tailRotation = useSharedValue('0deg');

  const [gameSpeed, setGameSpeed] = useState<number>(DEFAULT_GAME_SPEED);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gridSizeCol, setGridSizeCol] = useState<number>(DEFAULT_GRID_SIZE_COL);
  const [gridSizeRow, setGridSizeRow] = useState<number>(DEFAULT_GRID_SIZE_ROW);
  const [backgroundColor1, setBackgroundColor1] = useState<string>(
    Colors.Games.Snake.backgroundColor1.paleYellow
  );
  const [backgroundColor2, setBackgroundColor2] = useState<string>(
    Colors.Games.Snake.backgroundColor2.paleYellow
  );

  const CELL_SIZE = Math.min(
    Math.floor((screenWidth * 0.9) / gridSizeCol),
    Math.floor((screenHeight * 0.6) / gridSizeRow)
  );

  const GRID_WIDTH = CELL_SIZE * gridSizeCol;
  const GRID_HEIGHT = CELL_SIZE * gridSizeRow;
  const INITIAL_SNAKE = useMemo(() => {
    return {
      x: Math.floor(gridSizeCol / 2),
      y: Math.floor(gridSizeRow / 2),
    };
  }, [gridSizeCol, gridSizeRow]);

  const [snake, setSnake] = useState<Position[]>([INITIAL_SNAKE]);

  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const addCoins = coinStore((state) => state.addCoins);

  const bestScoreForThisGame = scoreStore((state) =>
    state.getBestScore(gameId)
  );
  const setBestScore = scoreStore((state) => state.setBestScore);

  const generateFood = useCallback((): void => {
    let newFood: Position;

    do {
      newFood = {
        x: Math.floor(Math.random() * gridSizeCol),
        y: Math.floor(Math.random() * gridSizeRow),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    setFood(newFood);
  }, [snake, gridSizeCol, gridSizeRow]);

  const initGame = useCallback((): void => {
    setSnake([INITIAL_SNAKE]);
    generateFood();
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsBottomSheetOpen(false);
  }, [INITIAL_SNAKE, generateFood]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (): boolean => true,
    onMoveShouldSetPanResponder: (): boolean => true,
    onPanResponderRelease: (
      _: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ): void => {
      if (isGameOver || isPaused) {
        return;
      }

      const {dx, dy} = gestureState;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > absDy) {
        if (dx > 0) {
          changeDirection(DIRECTIONS.RIGHT);
        } else if (dx < 0) {
          changeDirection(DIRECTIONS.LEFT);
        }
      } else {
        if (dy > 0) {
          changeDirection(DIRECTIONS.DOWN);
        } else if (dy < 0) {
          changeDirection(DIRECTIONS.UP);
        }
      }
    },
  });

  const changeDirection = (directionParam: Direction) => {
    setIsPaused(false);
    const current = directionRef.current;

    if (directionParam === DIRECTIONS.DOWN && current !== DIRECTIONS.UP) {
      directionRef.current = DIRECTIONS.DOWN;
      setDirection(DIRECTIONS.DOWN);
    }
    if (directionParam === DIRECTIONS.UP && current !== DIRECTIONS.DOWN) {
      directionRef.current = DIRECTIONS.UP;
      setDirection(DIRECTIONS.UP);
    }
    if (directionParam === DIRECTIONS.RIGHT && current !== DIRECTIONS.LEFT) {
      directionRef.current = DIRECTIONS.RIGHT;
      setDirection(DIRECTIONS.RIGHT);
    }
    if (directionParam === DIRECTIONS.LEFT && current !== DIRECTIONS.RIGHT) {
      directionRef.current = DIRECTIONS.LEFT;
      setDirection(DIRECTIONS.LEFT);
    }
  };

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) {
      return;
    }

    const moveSnake = (): void => {
      const head = snake[0];
      const newHead: Position = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= gridSizeCol ||
        newHead.y < 0 ||
        newHead.y >= gridSizeRow ||
        snake
          .slice(0, -1)
          .some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        SoundModule.playSound('gameOver');
        if (score > bestScoreForThisGame) {
          addCoins(score * bestScorePointMultiplier);
          setBestScore(gameId, score);
        } else {
          addCoins(score * winPointMultiplier);
        }

        return;
      }

      const newSnake: Position[] = [newHead, ...snake];

      if (newHead.x === food.x && newHead.y === food.y) {
        SoundModule.playSound('snakeAppleEat');
        Vibration.vibrate(150);
        setScore((prevScore) => prevScore + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    gameLoopRef.current = setTimeout(moveSnake, gameSpeed);

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [
    snake,
    direction,
    food,
    isGameOver,
    isPaused,
    gameSpeed,
    gridSizeCol,
    gridSizeRow,
    setBestScore,
    score,
    generateFood,
    addCoins,
    bestScoreForThisGame,
  ]);

  useEffect(() => {
    if (isGameOver || isPaused) {
      return;
    }

    switch (direction) {
      case DIRECTIONS.DOWN:
        headRotation.value = withTiming('90deg', {duration: gameSpeed});
        break;
      case DIRECTIONS.LEFT:
        headRotation.value = withTiming('180deg', {duration: gameSpeed});
        break;
      case DIRECTIONS.UP:
        headRotation.value = withTiming('270deg', {duration: gameSpeed});
        break;
      case DIRECTIONS.RIGHT:
      default:
        headRotation.value = withTiming('0deg', {duration: gameSpeed});
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, gameSpeed]);

  useEffect(() => {
    if (isGameOver || isPaused) {
      return;
    }
    if (snake.length < 2) {
      return;
    }
    const tail = snake[snake.length - 1];
    const beforeTail = snake[snake.length - 2];
    let tailDirection: Direction;

    if (tail.x === beforeTail.x) {
      tailDirection = tail.y > beforeTail.y ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    } else {
      tailDirection =
        tail.x > beforeTail.x ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    }

    switch (tailDirection) {
      case DIRECTIONS.UP:
        tailRotation.value = withTiming('90deg', {duration: gameSpeed});
        break;
      case DIRECTIONS.DOWN:
        tailRotation.value = withTiming('270deg', {duration: gameSpeed});
        break;
      case DIRECTIONS.LEFT:
        tailRotation.value = withTiming('0deg', {duration: gameSpeed});
        break;
      case DIRECTIONS.RIGHT:
        tailRotation.value = withTiming('180deg', {duration: gameSpeed});
        break;
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snake]);

  const headAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: headRotation.value}, {scale: 1.1}],
    };
  });
  const bodyAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: 1.1}],
    };
  });
  const tailAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: tailRotation.value}, {scale: 1.1}],
    };
  });

  const renderGrid = (): JSX.Element[] => {
    const grid: JSX.Element[] = [];

    for (let row = 0; row < gridSizeRow; row++) {
      for (let col = 0; col < gridSizeCol; col++) {
        const isSnake = snake.some(
          (segment) => segment.x === col && segment.y === row
        );

        const isHead = snake[0].x === col && snake[0].y === row;
        const isTail =
          snake[snake.length - 1].x === col &&
          snake[snake.length - 1].y === row &&
          !isHead;
        const isFood = food.x === col && food.y === row;

        let backgroundColor;
        if (
          (row % 2 === 0 && col % 2 === 1) ||
          (row % 2 === 1 && col % 2 === 0)
        ) {
          backgroundColor = backgroundColor1;
        }
        grid.push(
          <View
            key={`${row}-${col}`}
            className="absolute"
            style={[
              {width: CELL_SIZE, height: CELL_SIZE},
              {backgroundColor: backgroundColor},
              {top: row * CELL_SIZE, left: col * CELL_SIZE},
            ]}>
            {isSnake && !isHead && !isTail && (
              <Animated.Image
                resizeMode="contain"
                className="h-full w-full"
                style={bodyAnimatedStyle}
                source={require('./Assets/snakebody.png')}
              />
            )}
            {isHead && (
              <Animated.Image
                resizeMode="contain"
                className="h-full w-full"
                style={headAnimatedStyle}
                source={require('./Assets/snakehead.png')}
              />
            )}
            {isTail && (
              <Animated.Image
                resizeMode="contain"
                className="h-full w-full"
                style={tailAnimatedStyle}
                source={require('./Assets/snaketail.png')}
              />
            )}
            {isFood && (
              <Image
                resizeMode="contain"
                className="h-full w-full"
                source={require('./Assets/apple.png')}
              />
            )}
          </View>
        );
      }
    }

    return grid;
  };

  const togglePause = (): void => {
    setIsPaused(!isPaused);
  };

  const openSettings = () => {
    setIsPaused(true);
    setIsBottomSheetOpen(true);
  };

  useEffect(() => {
    SoundModule.loadSound('snakeAppleEat', 'apple_bite');
    SoundModule.loadSound('gameOver', 'game_over');

    return () => {
      SoundModule.unloadSound('snakeAppleEat');
      SoundModule.unloadSound('gameOver');
    };
  }, []);

  const shadowColor = isDarkMode
    ? Colors.DarkTheme.Text
    : Colors.LightTheme.Text;

  const gameOverContent = () => {
    return (
      <View className="h-full w-full justify-center items-center p-2">
        <View className="flex-row w-full h-1/2 justify-around items-center">
          <Icon adjustsFontSizeToFit size={48} name="trophy" color="white" />
          <Text
            adjustsFontSizeToFit
            className=" text-2xl text-darktext font-semibold align-middle text-center">
            Best Score: {bestScoreForThisGame}
          </Text>
          <Icon adjustsFontSizeToFit size={48} name="trophy" color="white" />
        </View>
        <View className="w-full h-1/2 justify-around items-center">
          <Text
            adjustsFontSizeToFit
            className=" text-2xl text-darktext font-semibold align-middle text-center">
            Score: {score}
          </Text>
        </View>
      </View>
    );
  };

  const gamePausedContent = () => {
    return (
      <View className="h-full w-full justify-center items-center p-2">
        <Text
          adjustsFontSizeToFit
          className="text-3xl text-darktext font-semibold align-middle text-center">
          Click to continue
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 items-center bg-lightbg dark:bg-darkbg px-6">
      <View style={{height: screenHeight * 0.6}}>
        <View
          style={{
            width: GRID_WIDTH,
            height: GRID_HEIGHT,
            backgroundColor: backgroundColor2,
          }}
          {...panResponder.panHandlers}>
          {renderGrid()}
        </View>
      </View>
      <View className="flex-1 w-full justify-between items-center gap-2">
        <View className="h-1/4 w-full flex-row">
          <View className="h-full w-2/5 justify-center items-start">
            <View
              className="flex-row w-full h-full items-center bg-lightsecondary dark:bg-darksecondary rounded-lg"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}>
              <Text className="text-xl font-bold text-lighttext ml-2 dark:text-darktext">
                Score:{' '}
              </Text>
              <Text className="text-xl font-bold text-lighttext dark:text-darktext">
                {score}
              </Text>
            </View>
          </View>
          <View className="w-3/5 flex-row justify-end items-center gap-3">
            <TouchableOpacity
              disabled={isGameOver}
              className="flex-row p-4 rounded-full bg-lightsecondary dark:bg-darksecondary justify-around items-center"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}
              onPress={togglePause}>
              <Icon
                size={24}
                name={isPaused ? 'play' : 'pause'}
                color={
                  isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row p-4 rounded-full bg-lightsecondary dark:bg-darksecondary justify-around items-center"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}
              onPress={initGame}>
              <Icon
                size={24}
                name="refresh"
                color={
                  isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row p-4 rounded-full bg-lightsecondary dark:bg-darksecondary justify-around items-center"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}
              onPress={openSettings}>
              <Icon
                size={24}
                name="settings"
                color={
                  isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="h-3/4 w-full items-center justify-center p-3">
          <View className="flex-row h-1/2 w-3/4 items-end justify-center">
            <View className="flex-1 aspect-square" />
            <View
              className="flex-1 aspect-square m-1 bg-lightsecondary dark:bg-darksecondary items-center justify-center rounded-xl"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}>
              <TouchableOpacity
                className="p-2 rounded-md"
                onPress={() => changeDirection(DIRECTIONS.UP)}>
                <Icon
                  size={24}
                  name="arrow-up"
                  color={
                    isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
                  }
                />
              </TouchableOpacity>
            </View>
            <View className="flex-1 aspect-square" />
          </View>
          <View className="flex-row h-1/2 w-3/4 items-start justify-center">
            <View
              className="flex-1 aspect-square m-1 bg-lightsecondary dark:bg-darksecondary items-center justify-center rounded-xl"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}>
              <TouchableOpacity
                className="p-2 rounded-md"
                onPress={() => changeDirection(DIRECTIONS.LEFT)}>
                <Icon
                  size={24}
                  name="arrow-back"
                  color={
                    isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
                  }
                />
              </TouchableOpacity>
            </View>
            <View
              className="flex-1 aspect-square m-1 bg-lightsecondary dark:bg-darksecondary items-center justify-center rounded-xl"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}>
              <TouchableOpacity
                className="p-2 rounded-md"
                onPress={() => changeDirection(DIRECTIONS.DOWN)}>
                <Icon
                  size={24}
                  name="arrow-down"
                  color={
                    isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
                  }
                />
              </TouchableOpacity>
            </View>
            <View
              className="flex-1 aspect-square m-1 bg-lightsecondary dark:bg-darksecondary items-center justify-center rounded-xl"
              style={[styles.keyShadow, {shadowColor: shadowColor}]}>
              <TouchableOpacity
                className="p-2 rounded-md"
                onPress={() => changeDirection(DIRECTIONS.RIGHT)}>
                <Icon
                  size={24}
                  name="arrow-forward"
                  color={
                    isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {isGameOver && (
        <GameStatusCard
          buttonFunction={initGame}
          buttonIconName="refresh"
          title="Game Over"
          content={gameOverContent()}
          buttonLabel="refresh"
        />
      )}
      {isPaused && !isGameOver && !isBottomSheetOpen && (
        <GameStatusCard
          buttonFunction={togglePause}
          buttonIconName="play"
          title="Game Paused"
          content={gamePausedContent()}
          opacity={0.9}
          buttonLabel="play"
        />
      )}
      {isBottomSheetOpen && (
        <Bottomsheet
          isOpen={isBottomSheetOpen}
          toggleSheet={setIsBottomSheetOpen}
          gameSpeed={gameSpeed}
          setGameSpeed={setGameSpeed}
          gridSizeCol={gridSizeCol}
          setGridSizeCol={setGridSizeCol}
          gridSizeRow={gridSizeRow}
          setGridSizeRow={setGridSizeRow}
          backgroundColor1={backgroundColor1}
          setBackgroundColor1={setBackgroundColor1}
          backgroundColor2={backgroundColor2}
          setBackgroundColor2={setBackgroundColor2}
          initGame={initGame}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  keyShadow: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 2.22,
    elevation: 5,
  },
});
