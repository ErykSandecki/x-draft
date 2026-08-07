import { fireEvent, render } from '@testing-library/react';
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

describe('Toolbar behaviors', () => {
  it('should stop a mouse-down from propagating to the canvas underneath', () => {
    // mock
    const parentMouseDown = vi.fn();

    // before
    const { container } = render(
      <div onMouseDown={parentMouseDown}>
        <Provider store={store}>
          <Toolbar />
        </Provider>
      </div>,
    );

    // find
    const toolbar = container.querySelector('[class*="Toolbar"]') as Element;

    // action
    fireEvent.mouseDown(toolbar);

    // result
    expect(parentMouseDown).not.toHaveBeenCalled();
  });
});
