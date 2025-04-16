import {render} from '@testing-library/react-native';
import App from '../src/App';

describe('App', () => {
  it('renders App successfully', () => {
    const {toJSON} = render(<App />);
    const tree = toJSON();

    expect(tree).toBeTruthy();
  });
});
