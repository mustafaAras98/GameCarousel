import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import ThemeSwitch from '../ThemeSwitch';

describe('ThemeSwitch', () => {
  it('render successfully', () => {
    const {toJSON} = render(<ThemeSwitch />);
    const tree = toJSON();

    expect(tree).toBeTruthy();
  });

  it('accessibility settings are true', () => {
    const {getByTestId} = render(<ThemeSwitch />);
    const pressable = getByTestId('ThemeSwitchPressable');

    //Because of accessibilityState depended on theme it should be true too
    expect(pressable.props.accessibilityState.checked).toBe(true);

    fireEvent.press(pressable);
    expect(pressable.props.accessibilityState.checked).toBe(false);

    fireEvent.press(pressable);
    fireEvent.press(pressable);
    expect(pressable.props.accessibilityState.checked).toBe(false);
  });
});
