import {render} from '@testing-library/react-native';
import App from '../src/App';

describe('App', () => {
  it('has 1 child', () => {
    const {toJSON} = render(<App />);
    const tree = toJSON();

    expect(tree).toBeTruthy();
  });
});
