import { render } from '@testing-library/react';

// components
import HomePage from './HomePage';

describe('HomePage snapshots', () => {
  it('should render HomePage', () => {
    // before
    const { asFragment } = render(<HomePage />);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
