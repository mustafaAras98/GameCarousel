import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

import Icon from '@react-native-vector-icons/ionicons';
import {ThemeType, useThemeStore} from '../../Stores/themeStore';
import {Colors} from '../../Constants/Colors';

type NumberInputWithButtonsProps = {
  label: string;
  value: number;
  setValue: (val: number) => void;
  placeholder?: string;
  incVal?: number;
  maxValue?: number;
  minValue?: number;
};

const NumberInputWithButtons: React.FC<NumberInputWithButtonsProps> = ({
  label,
  value,
  setValue,
  placeholder = 'e.g., 0',
  incVal = 1,
  maxValue = Number.MAX_SAFE_INTEGER,
  minValue = Number.MIN_SAFE_INTEGER,
}) => {
  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = theme === ThemeType.DarkTheme;

  const handleIncrement = useCallback(() => {
    const num = value;
    const next = num + incVal;
    if (next <= maxValue) {
      setValue(next);
    }
  }, [incVal, maxValue, setValue, value]);

  const handleDecrement = useCallback(() => {
    const num = value;
    const next = num - incVal;
    if (next >= minValue) {
      setValue(next);
    }
  }, [incVal, minValue, setValue, value]);

  const handleChangeText = useCallback(
    (val: string) => {
      const numeric = parseInt(val, 10);

      if (isNaN(numeric)) {
        setValue(minValue);
        return;
      }

      if (numeric < minValue) {
        setValue(minValue);
        return;
      }

      if (numeric > maxValue) {
        setValue(maxValue);
        return;
      }

      setValue(numeric);
    },
    [maxValue, minValue, setValue]
  );

  return (
    <View className="w-full mb-4">
      <Text className="text-lighttext dark:text-darktext mb-1">{label}</Text>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={value <= minValue}
          className="w-1/6 h-full items-center justify-center border border-gray-500 dark:border-gray-300 rounded-md"
          accessibilityLabel={`Decrease ${label}`}
          accessibilityHint={`Decrase value by ${incVal}`}>
          <Icon
            name="remove"
            size={20}
            color={isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text}
          />
        </TouchableOpacity>
        <TextInput
          className="flex-1 p-2 h-full border border-gray-500 dark:border-gray-300 rounded-md text-center text-lighttext dark:text-darktext"
          keyboardType="numeric"
          value={value.toString()}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.Common.Disabled}
        />
        <TouchableOpacity
          onPress={handleIncrement}
          disabled={value >= maxValue}
          className="w-1/6 h-full items-center justify-center border dark:border-gray-300 border-gray-500 rounded-md"
          accessibilityLabel={`Increase ${label}`}
          accessibilityHint={`Increase value by ${incVal}`}>
          <Icon
            name="add"
            size={20}
            color={isDarkMode ? Colors.DarkTheme.Text : Colors.LightTheme.Text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(NumberInputWithButtons);
