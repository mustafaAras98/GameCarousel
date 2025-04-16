import React from 'react';
import {render} from '@testing-library/react-native';
import GameSelectionCarousel from './GameSelectionCarousel';

describe('ThemeSwitch', () => {
  it('render successfully', () => {
    const {toJSON} = render(<GameSelectionCarousel cardHeight={100} />);
    const tree = toJSON();

    expect(tree).toBeTruthy();
  });
});
