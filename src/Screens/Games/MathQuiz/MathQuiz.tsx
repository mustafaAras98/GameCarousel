import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  NativeModules,
  Keyboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import GameStatusCard from '../../../Components/GameStatusCard';

interface Question {
  num1: number;
  num2: number;
  operation: '+' | '-' | 'x' | '/';
  answer: number;
}

interface GameStats {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

const {SoundModule} = NativeModules;
const gameDurationSeconds = 60;
const correctAnswerPoints = 10;
const maxAddSubNumber = 50;
const maxMultiplayerNumber = 12;
const maxDivisionNumber = 9;

const MathQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
  });
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(gameDurationSeconds);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [showGameEndCard, setShowGameEndCard] = useState<boolean>(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState<boolean>(false);

  const questionScale = useSharedValue(1);
  const scoreScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const feedbackOpacity = useSharedValue(0);
  const feedbackTranslateY = useSharedValue(0);

  useEffect(() => {
    SoundModule.loadSound('failSound', 'fail_sound');
    SoundModule.loadSound('successSound', 'success_sound');

    return () => {
      SoundModule.unloadSound('failSound');
      SoundModule.unloadSound('successSound');
    };
  }, []);

  const generateQuestion = useCallback((): Question => {
    const operations: Array<'+' | '-' | 'x' | '/'> = ['+', '-', 'x', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1: number, num2: number, answer: number;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * maxAddSubNumber) + 1;
        num2 = Math.floor(Math.random() * maxAddSubNumber) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * maxAddSubNumber) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case 'x':
        num1 = Math.floor(Math.random() * maxMultiplayerNumber) + 1;
        num2 = Math.floor(Math.random() * maxMultiplayerNumber) + 1;
        answer = num1 * num2;
        break;
      case '/':
        answer = Math.floor(Math.random() * maxDivisionNumber) + 1;
        num2 = Math.floor(Math.random() * maxDivisionNumber) + 1;
        num1 = answer * num2;
        break;

      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }

    return {num1, num2, operation, answer};
  }, []);

  const startNewQuestion = useCallback(() => {
    const newQuestion = generateQuestion();
    setCurrentQuestion(newQuestion);
    setUserAnswer('');

    questionScale.value = withSequence(
      withTiming(0.8, {duration: 100}),
      withSpring(1, {damping: 8, stiffness: 100})
    );
  }, [generateQuestion, questionScale]);

  const checkAnswer = useCallback(() => {
    if (isProcessingAnswer || !currentQuestion || userAnswer.trim() === '') {
      return;
    }

    setIsProcessingAnswer(true);

    const userNum = parseInt(userAnswer, 10);
    const isCorrect = userNum === currentQuestion.answer;

    if (isCorrect) {
      SoundModule.playSound('successSound');
    } else {
      SoundModule.playSound('failSound');
    }

    setGameStats((prev) => ({
      score: prev.score + (isCorrect ? correctAnswerPoints : 0),
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
    }));

    feedbackOpacity.value = withSequence(
      withTiming(1, {duration: 200}),
      withTiming(0, {duration: 800})
    );

    feedbackTranslateY.value = withSequence(
      withTiming(-30, {duration: 200}),
      withTiming(-60, {duration: 800})
    );

    if (isCorrect) {
      scoreScale.value = withSequence(
        withSpring(1.3, {damping: 6, stiffness: 200}),
        withSpring(1, {damping: 8, stiffness: 100})
      );
    }

    setTimeout(() => {
      feedbackTranslateY.value = 0;
      setIsProcessingAnswer(false);
      startNewQuestion();
    }, 1000);
  }, [
    isProcessingAnswer,
    currentQuestion,
    userAnswer,
    feedbackOpacity,
    feedbackTranslateY,
    scoreScale,
    startNewQuestion,
  ]);

  const startGame = useCallback(() => {
    setIsGameStarted(true);
    setIsGameActive(true);
    setTimeLeft(gameDurationSeconds);
    setGameStats({score: 0, totalQuestions: 0, correctAnswers: 0});
    startNewQuestion();
    setShowGameEndCard(false);
  }, [startNewQuestion]);

  const endGame = useCallback(() => {
    setIsGameActive(false);
    Keyboard.dismiss();
    setShowGameEndCard(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            runOnJS(endGame)();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGameActive, timeLeft, endGame]);

  const questionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: questionScale.value}],
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scoreScale.value}],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }));

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
    transform: [{translateY: feedbackTranslateY.value}],
  }));

  const handleButtonPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, {duration: 100}),
      withTiming(1, {duration: 100})
    );
    checkAnswer();
  };

  if (!isGameStarted) {
    return (
      <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-4xl font-bold text-lighttext dark:text-darktext mb-4 text-center">
            Math Quiz
          </Text>
          <Text className="text-xl text-lighttext dark:text-darktext mb-8 text-center opacity-90">
            Exercise your mind with addition and subtraction!
          </Text>
          <TouchableOpacity
            onPress={startGame}
            className="bg-lightaccent dark:bg-darkaccent rounded-2xl px-8 py-4"
            activeOpacity={0.8}>
            <Text
              adjustsFontSizeToFit
              className="text-2xl font-bold text-lighttext dark:text-darktext">
              Start Game
            </Text>
          </TouchableOpacity>
          <View className="mt-8 bg-white/20 rounded-xl p-4">
            <Text
              adjustsFontSizeToFit
              className="text-lighttext dark:text-darktext text-center font-semibold">
              {gameDurationSeconds} seconds time
            </Text>
            <Text
              adjustsFontSizeToFit
              className="text-lighttext dark:text-darktext text-center font-semibold">
              Quick Math Game
            </Text>
            <Text
              adjustsFontSizeToFit
              className="text-lighttext dark:text-darktext text-center font-semibold">
              Every Correct Answer's are 10 points
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const accuracy =
    gameStats.totalQuestions > 0
      ? Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100)
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex-row justify-between items-center px-6 py-4">
        <Animated.View style={scoreAnimatedStyle}>
          <View className="bg-darkbg/20 dark:bg-lightbg/20 rounded-xl px-4 py-2">
            <Text className="text-lighttext dark:text-darktext font-bold text-lg">
              Score: {gameStats.score}
            </Text>
          </View>
        </Animated.View>
        <View className="bg-darkbg/20 dark:bg-lightbg/20 rounded-xl px-4 py-2">
          <Text className="text-lighttext dark:text-darktext font-bold text-lg">
            ⏰ {timeLeft}s
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1 justify-center items-center px-6">
          {currentQuestion && (
            <>
              <Animated.View
                style={questionAnimatedStyle}
                className="bg-lightsecondary dark:bg-darksecondary rounded-3xl p-8 mb-8 w-4/5">
                <Text className="text-6xl font-bold text-lighttext dark:text-darktext text-center mb-4">
                  {currentQuestion.num1} {currentQuestion.operation}{' '}
                  {currentQuestion.num2}
                </Text>
                <View className="h-1 bg-lightprimary dark:bg-darkprimary rounded-full mb-4" />
                <Text className="text-2xl text-lighttext/80 dark:text-darktext/80 text-center">
                  Answer = ?
                </Text>
              </Animated.View>
              <View className="w-4/5 mb-6">
                <TextInput
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  keyboardType="numeric"
                  placeholder="Enter your answer..."
                  placeholderTextColor="#94a3b8"
                  className="bg-white rounded-2xl px-6 py-4 text-2xl font-bold text-center text-gray-800 shadow-lg"
                  onSubmitEditing={handleButtonPress}
                  autoFocus
                  editable={!isProcessingAnswer && isGameActive}
                />
              </View>
              <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity
                  onPress={handleButtonPress}
                  className="bg-lightaccent dark:bg-darkaccent rounded-2xl px-8 py-4"
                  activeOpacity={0.8}
                  disabled={isProcessingAnswer || userAnswer.trim() === ''}>
                  <Text className="text-2xl font-bold text-lighttext dark:text-darktext">
                    Submit ✓
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                style={feedbackAnimatedStyle}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Text className="text-4xl font-bold text-lighttext dark:text-darktext">
                  {userAnswer === currentQuestion.answer.toString()
                    ? '✓ Correct!'
                    : '✗ False!'}
                </Text>
              </Animated.View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
      <View className="px-6 pb-6">
        <View className="bg-lighttext/20 dark:bg-darktext/20 rounded-xl p-4 flex-row justify-around">
          <View className="items-center">
            <Text className="text-lighttext dark:text-darktext font-bold text-lg">
              {gameStats.correctAnswers}
            </Text>
            <Text className="text-lighttext/80 dark:text-darktext/80 text-sm">
              Correct
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-lighttext dark:text-darktext font-bold text-lg">
              {gameStats.totalQuestions}
            </Text>
            <Text className="text-lighttext/80 dark:text-darktext/80 text-sm">
              Total
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-lighttext/80 dark:text-darktext/80 font-bold text-lg">
              {accuracy}%
            </Text>
            <Text className="text-lighttext/80 dark:text-darktext/80 text-sm">
              Accuracy
            </Text>
          </View>
        </View>
      </View>
      {showGameEndCard && (
        <View className="flex-1 absolute w-full h-full px-6 items-center">
          <GameStatusCard
            title="Game Over!"
            content={
              <View className="flex-col items-center">
                <Text className="text-2xl text-darktext font-bold mb-2">
                  Score: {gameStats.score}
                </Text>
                <Text className="text-xl text-darktext">
                  Correct Answers: {gameStats.correctAnswers}/
                  {gameStats.totalQuestions}
                </Text>
                <Text className="text-xl text-darktext">
                  Accuracy: {accuracy}%
                </Text>
              </View>
            }
            buttonFunction={startGame}
            buttonIconName="refresh"
            buttonLabel="Play Again"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default React.memo(MathQuiz);
