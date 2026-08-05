import { render } from '@testing-library/react';

// components
import Canvas from './Canvas';

describe('Canvas snapshots', () => {
  it('should render Canvas', () => {
    // before
    const { asFragment } = render(<Canvas />);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
