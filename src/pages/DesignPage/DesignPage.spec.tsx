import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

// components
import DesignPage from './DesignPage';

// store
import { store } from 'store';

describe('DesignPage snapshots', () => {
  it('should render DesignPage', () => {
    // before
    const { asFragment } = render(
      <Provider store={store}>
        <DesignPage />
      </Provider>,
    );

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
