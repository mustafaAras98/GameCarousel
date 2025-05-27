import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {Colors} from '../../../../Constants/Colors';
import Icon from '@react-native-vector-icons/ionicons';

import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {ThemeType, useThemeStore} from '../../../../Stores/themeStore';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import NumberInputWithButtons from '../../../../Components/NumberInputWithButtons/NumberInputWithButtons';
import {scale} from '../../../../Constants/Constants';

interface BottomsheetInterface {
  isOpen: boolean;
  toggleSheet: Dispatch<SetStateAction<boolean>>;
  gameSpeed: number;
  setGameSpeed: Dispatch<SetStateAction<number>>;
  gridSizeCol: number;
  setGridSizeCol: Dispatch<SetStateAction<number>>;
  gridSizeRow: number;
  setGridSizeRow: Dispatch<SetStateAction<number>>;
  backgroundColor1: string;
  setBackgroundColor1: Dispatch<SetStateAction<string>>;
  backgroundColor2: string;
  setBackgroundColor2: Dispatch<SetStateAction<string>>;
  initGame: () => void;
}

const Bottomsheet: React.FC<BottomsheetInterface> = ({
  isOpen,
  toggleSheet,
  gameSpeed,
  setGameSpeed,
  gridSizeCol,
  setGridSizeCol,
  gridSizeRow,
  setGridSizeRow,
  backgroundColor1 = Colors.Games.Snake.backgroundColor1.paleYellow,
  setBackgroundColor1,
  backgroundColor2 = Colors.Games.Snake.backgroundColor2.paleYellow,
  setBackgroundColor2,
  initGame,
}) => {
  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['90%'], []);

  const [localGameSpeed, setLocalGameSpeed] = useState<number>(gameSpeed);
  const [localGridSizeCol, setLocalGridSizeCol] = useState<number>(gridSizeCol);
  const [localGridSizeRow, setLocalGridSizeRow] = useState<number>(gridSizeRow);
  const [localBackgroundColor1, setLocalBackgroundColor1] =
    useState<string>(backgroundColor1);
  const [localBackgroundColor2, setLocalBackgroundColor2] =
    useState<string>(backgroundColor2);

  React.useEffect(() => {
    if (isOpen) {
      setLocalGameSpeed(gameSpeed);
      setLocalGridSizeCol(gridSizeCol);
      setLocalGridSizeRow(gridSizeRow);
      setLocalBackgroundColor1(backgroundColor1);
      setLocalBackgroundColor2(backgroundColor2);
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [
    isOpen,
    gameSpeed,
    gridSizeCol,
    gridSizeRow,
    backgroundColor1,
    backgroundColor2,
  ]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        toggleSheet(false);
      }
    },
    [toggleSheet]
  );

  const handleApplyChanges = () => {
    const newGameSpeed = localGameSpeed;
    const newGridSizeCol = localGridSizeCol;
    const newGridSizeRow = localGridSizeRow;

    if (!isNaN(newGameSpeed) && newGameSpeed > 0) {
      setGameSpeed(newGameSpeed);
    }
    if (!isNaN(newGridSizeCol) && newGridSizeCol > 0) {
      setGridSizeCol(newGridSizeCol);
    }
    if (!isNaN(newGridSizeRow) && newGridSizeRow > 0) {
      setGridSizeRow(newGridSizeRow);
    }
    setBackgroundColor1(localBackgroundColor1);
    setBackgroundColor2(localBackgroundColor2);

    initGame();
    toggleSheet(false);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!isOpen) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      // eslint-disable-next-line react-native/no-inline-styles
      backgroundStyle={{
        backgroundColor: isDarkMode
          ? Colors.DarkTheme.Background
          : Colors.LightTheme.Background,
        borderRadius: 20,
      }}
      handleIndicatorStyle={{backgroundColor: Colors.LightTheme.Text}}>
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        <Text className="text-xl font-bold text-lighttext dark:text-darktext mb-4 text-center">
          Game Settings
        </Text>
        <View className="w-full h-1/6">
          <NumberInputWithButtons
            label="Game Speed (ms): "
            value={localGameSpeed}
            setValue={setLocalGameSpeed}
            placeholder="e.g., 60"
            minValue={10}
            maxValue={500}
            incVal={5}
          />
        </View>
        <View className="w-full h-1/6">
          <NumberInputWithButtons
            label="Columns"
            value={localGridSizeCol}
            setValue={setLocalGridSizeCol}
            placeholder="e.g., 12"
            minValue={3}
            maxValue={20}
          />
        </View>
        <View className="w-full h-1/6">
          <NumberInputWithButtons
            label="Rows"
            value={localGridSizeRow}
            setValue={setLocalGridSizeRow}
            placeholder="e.g., 15"
            minValue={3}
            maxValue={20}
          />
        </View>
        <View className="w-full h-2/6 gap-4">
          <View className="w-full">
            <Text className="text-lighttext dark:text-darktext mb-2">
              Background Color:
            </Text>
            <View className="flex-row justify-between">
              {Object.entries(Colors.Games.Snake.backgroundColor1).map(
                ([name, color]) => {
                  const isSelected = localBackgroundColor1 === color;
                  return (
                    <TouchableOpacity
                      key={name}
                      onPress={() => setLocalBackgroundColor1(color)}
                      className={`w-10 h-10 rounded-md items-center justify-center ${
                        isSelected
                          ? 'border-2 border-lightaccent dark:border-darkaccent'
                          : 'border border-gray-500 dark:border-gray-300'
                      }`}
                      style={{backgroundColor: color}}>
                      {isSelected && (
                        <Animated.View entering={FadeInUp.duration(200)}>
                          <Icon
                            adjustsFontSizeToFit
                            size={24}
                            name="checkmark"
                            color={
                              isDarkMode
                                ? Colors.DarkTheme.Accent
                                : Colors.LightTheme.Accent
                            }
                          />
                        </Animated.View>
                      )}
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </View>
          <View className="w-full">
            <Text className="text-lighttext dark:text-darktext mb-2">
              Background Color 2:
            </Text>
            <View className="flex-row justify-between">
              {Object.entries(Colors.Games.Snake.backgroundColor2).map(
                ([name, color]) => {
                  const isSelected = localBackgroundColor2 === color;
                  return (
                    <TouchableOpacity
                      key={name}
                      onPress={() => setLocalBackgroundColor2(color)}
                      className={`w-10 h-10 rounded-md items-center justify-center ${
                        isSelected
                          ? 'border-2 border-lightaccent dark:border-darkaccent'
                          : 'border border-gray-500 dark:border-gray-300'
                      }`}
                      style={{backgroundColor: color}}>
                      {isSelected && (
                        <Animated.View entering={FadeInDown.duration(200)}>
                          <Icon
                            adjustsFontSizeToFit
                            size={24}
                            name="checkmark"
                            color={
                              isDarkMode
                                ? Colors.DarkTheme.Accent
                                : Colors.LightTheme.Accent
                            }
                          />
                        </Animated.View>
                      )}
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </View>
        </View>
        <View className="w-full h-1/6">
          <TouchableOpacity
            className="bg-lightprimary dark:bg-darkprimary p-3 rounded-lg w-full items-center mt-2"
            onPress={handleApplyChanges}>
            <Text className="text-white font-bold text-lg">Apply Changes</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    gap: scale(4),
  },
});

export default Bottomsheet;
