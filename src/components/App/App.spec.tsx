import { render } from '@testing-library/react';

// components
import App from './App';

describe('App snapshots', () => {
  it('should render App', () => {
    // before
    const { asFragment } = render(<App />);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
