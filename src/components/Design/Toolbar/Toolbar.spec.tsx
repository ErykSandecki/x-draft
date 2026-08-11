import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

// components
import Toolbar from './Toolbar';

// store
import { store } from 'store';

describe('Toolbar snapshots', () => {
  it('should render Toolbar', () => {
    // before
    const { asFragment } = render(
      <Provider store={store}>
        <Toolbar />
      </Provider>,
    );

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
