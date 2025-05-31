import {
  View,
  ImageBackground,
  NativeModules,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

import Icon from '@react-native-vector-icons/fontawesome';

import {Colors} from '../../../Constants/Colors';
import {scale} from '../../../Constants/Constants';

import maleIdle from './Assets/male_idle.png';
import malePaper from './Assets/male_paper.png';
import maleRock from './Assets/male_rock.png';
import maleScissor from './Assets/male_scissors.png';
import femaleIdle from './Assets/female_idle.png';
import femalePaper from './Assets/female_paper.png';
import femaleRock from './Assets/female_rock.png';
import femaleScissor from './Assets/female_scissors.png';
import scoreStore from '../../../Stores/scoreStore';

enum RockPaperScissorType {
  Idle = 0,
  Rock,
  Paper,
  Scissor,
}
enum GameResult {
  Win,
  Lose,
  Draw,
}
const {SoundModule} = NativeModules;

const maleImageArray = [maleIdle, maleRock, malePaper, maleScissor];
const femaleImageArray = [femaleIdle, femaleRock, femalePaper, femaleScissor];
const animationDuration = 166;
const gameId = 'rockpaperscissor';

const RockPaperScissor = () => {
  const bestScoreForThisGame = scoreStore((state) =>
    state.getBestScore(gameId)
  );
  const setBestScore = scoreStore((state) => state.setBestScore);

  useEffect(() => {
    SoundModule.loadSound('paperWin', 'paper_win');
    SoundModule.loadSound('rockWin', 'rock_win');
    SoundModule.loadSound('scissorWin', 'scissor_win');
    SoundModule.loadSound('draw', 'draw');

    return () => {
      SoundModule.unloadSound('paperWin');
      SoundModule.unloadSound('rockWin');
      SoundModule.unloadSound('scissorWin');
      SoundModule.unloadSound('draw');
    };
  }, []);

  const [consecutiveScore, setConsecutiveScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerImage, setPlayerImage] = useState<ImageSourcePropType>(maleIdle);
  const [computerImage, setComputerImage] =
    useState<ImageSourcePropType>(femaleIdle);

  const playerAnimY = useSharedValue(0);
  const playerAnimRotate = useSharedValue(0);
  const computerAnimY = useSharedValue(0);
  const computerAnimRotate = useSharedValue(0);

  const gameRules = {
    [RockPaperScissorType.Rock]: {
      beats: RockPaperScissorType.Scissor,
      winSound: 'rockWin',
      loseSound: 'rockWin',
    },
    [RockPaperScissorType.Paper]: {
      beats: RockPaperScissorType.Rock,
      winSound: 'paperWin',
      loseSound: 'paperWin',
    },
    [RockPaperScissorType.Scissor]: {
      beats: RockPaperScissorType.Paper,
      winSound: 'scissorWin',
      loseSound: 'scissorWin',
    },
  };

  const checkGameResult = (
    playerSelection: RockPaperScissorType,
    computerSelection: RockPaperScissorType
  ): GameResult => {
    if (
      playerSelection === RockPaperScissorType.Idle ||
      computerSelection === RockPaperScissorType.Idle ||
      playerSelection === computerSelection
    ) {
      SoundModule.playSound('draw');
      return GameResult.Draw;
    }

    const playerRule = gameRules[playerSelection];
    if (playerRule.beats === computerSelection) {
      SoundModule.playSound(playerRule.winSound);
      return GameResult.Win;
    }

    const computerWinningRule = gameRules[computerSelection];
    if (computerWinningRule.beats === playerSelection) {
      SoundModule.playSound(gameRules[computerSelection].loseSound);
      return GameResult.Lose;
    }

    return GameResult.Lose;
  };

  const finishGame = (selection: RockPaperScissorType) => {
    const randomSelection = Math.floor(Math.random() * 3 + 1);

    setPlayerImage(maleImageArray[selection]);
    setComputerImage(femaleImageArray[randomSelection]);

    const result = checkGameResult(selection, randomSelection);

    if (result === GameResult.Win) {
      setConsecutiveScore((prev) => prev + 1);
    } else if (result === GameResult.Lose) {
      if (consecutiveScore > bestScoreForThisGame) {
        setBestScore(gameId, consecutiveScore);
      }
      setConsecutiveScore(0);
    }

    setIsPlaying(false);
  };

  const startHandAnimation = (selection: RockPaperScissorType) => {
    playerAnimY.value = 0;
    playerAnimRotate.value = 0;
    computerAnimY.value = 0;
    computerAnimRotate.value = 0;

    playerAnimY.value = withRepeat(
      withSequence(
        withTiming(-50, {duration: animationDuration}),
        withTiming(0, {duration: animationDuration})
      ),
      3,
      false,
      () => {
        runOnJS(finishGame)(selection);
      }
    );

    computerAnimY.value = withRepeat(
      withSequence(
        withTiming(50, {duration: animationDuration}),
        withTiming(0, {duration: animationDuration})
      ),
      3,
      false
    );

    playerAnimRotate.value = withRepeat(
      withSequence(
        withTiming(1, {duration: animationDuration}),
        withTiming(-1, {duration: animationDuration}),
        withTiming(1, {duration: animationDuration}),
        withTiming(-1, {duration: animationDuration}),
        withTiming(1, {duration: animationDuration}),
        withTiming(0, {duration: animationDuration})
      ),
      1,
      false
    );

    computerAnimRotate.value = withRepeat(
      withSequence(
        withTiming(-1, {duration: animationDuration}),
        withTiming(1, {duration: animationDuration}),
        withTiming(-1, {duration: animationDuration}),
        withTiming(1, {duration: animationDuration}),
        withTiming(-1, {duration: animationDuration}),
        withTiming(0, {duration: animationDuration})
      ),
      1,
      false
    );
  };

  const handleSelection = (selection: RockPaperScissorType) => {
    SoundModule.playSound('click');
    setIsPlaying(true);
    startHandAnimation(selection);
  };

  const playerAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(playerAnimRotate.value, [0, 10], [0, 10]);

    return {
      transform: [{translateY: playerAnimY.value}, {rotate: `${rotate}deg`}],
    };
  });

  const computerAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(computerAnimRotate.value, [-10, 0], [-10, 0]);

    return {
      transform: [{translateY: computerAnimY.value}, {rotate: `${rotate}deg`}],
    };
  });

  return (
    <ImageBackground
      className="flex-1"
      resizeMode="cover"
      source={require('./Assets/rockpaperscissorbg.png')}>
      <View
        className="h-1/6 bg-lightsecondary dark:bg-darksecondary justify-center self-end mt-4 mr-4 rounded-2xl border-4 border-lightaccent dark:border-darkaccent items-center aspect-square"
        style={styles.keyShadow}>
        <Text className="h-full w-full align-middle text-center text-2xl font-extrabold text-darktext">
          Score:{' '}
          <Text className="font-medium text-darktext">{consecutiveScore}</Text>
        </Text>
      </View>
      <View className="absolute flex-1 w-full h-full z-1">
        <View className="absolute left-0 top-0 w-1/2 h-1/2">
          <Animated.Image
            className="w-full h-full"
            source={computerImage}
            resizeMode="contain"
            style={computerAnimatedStyle}
          />
        </View>
        <View className="absolute right-0 bottom-0 w-1/2 h-1/2">
          <Animated.Image
            className="w-full h-full"
            source={playerImage}
            resizeMode="contain"
            style={playerAnimatedStyle}
          />
        </View>
      </View>
      <View className="absolute flex-row bottom-4 h-1/6 w-4/5 self-center justify-around items-center gap-2">
        <TouchableOpacity
          onPress={() => handleSelection(RockPaperScissorType.Rock)}
          className="flex-1 justify-center items-center bg-lightsecondary dark:bg-darksecondary border-4 border-lightaccent dark:border-darkaccent rounded-full aspect-square"
          style={styles.keyShadow}
          disabled={isPlaying}
          activeOpacity={0.8}>
          <Icon
            adjustsFontSizeToFit
            name="hand-rock-o"
            color={Colors.DarkTheme.Text}
            size={scale(48)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSelection(RockPaperScissorType.Paper)}
          className="flex-1 justify-center items-center bg-lightsecondary dark:bg-darksecondary border-4 border-lightaccent dark:border-darkaccent rounded-full aspect-square mb-24"
          style={styles.keyShadow}
          disabled={isPlaying}
          activeOpacity={0.8}>
          <Icon
            adjustsFontSizeToFit
            name="hand-paper-o"
            color={Colors.DarkTheme.Text}
            size={scale(48)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSelection(RockPaperScissorType.Scissor)}
          className="flex-1 justify-center items-center bg-lightsecondary dark:bg-darksecondary border-4 border-lightaccent dark:border-darkaccent rounded-full aspect-square"
          style={styles.keyShadow}
          disabled={isPlaying}
          activeOpacity={0.8}>
          <Icon
            adjustsFontSizeToFit
            name="hand-scissors-o"
            color={Colors.DarkTheme.Text}
            size={scale(48)}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default RockPaperScissor;

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
