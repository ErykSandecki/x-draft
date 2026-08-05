import { render } from '@testing-library/react';

// components
import DesignPage from './DesignPage';

describe('DesignPage snapshots', () => {
  it('should render DesignPage', () => {
    // before
    const { asFragment } = render(<DesignPage />);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
