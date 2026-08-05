import { render } from '@testing-library/react';

// components
import Toolbar from './Toolbar';

describe('Toolbar snapshots', () => {
  it('should render Toolbar', () => {
    // before
    const { asFragment } = render(<Toolbar />);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
