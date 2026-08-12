import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';

// components
import TextEditOverlay from './TextEditOverlay';

// store
import designReducer, { startTextEdit } from 'store/design/slice';
import { TDesignState } from 'store/design/types';

const createTestStore = (): EnhancedStore<{ design: TDesignState }> => configureStore({ reducer: { design: designReducer } });

const renderWithStore = (store: EnhancedStore<{ design: TDesignState }>): ReturnType<typeof render> =>
  render(
    <Provider store={store}>
      <TextEditOverlay />
    </Provider>,
  );

describe('TextEditOverlay snapshots', () => {
  it('should render nothing when there is no text box being edited', () => {
    // before
    const { asFragment } = renderWithStore(createTestStore());

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('TextEditOverlay behaviors', () => {
  it('should render a focused, positioned editable box once a text box starts editing', () => {
    // mock
    const store = createTestStore();

    store.dispatch(startTextEdit({ height: 20, width: 100, x: 10, y: 10 }));

    // before
    const { container } = renderWithStore(store);

    // find
    const element = container.querySelector('[contenteditable="true"]');

    // result
    expect(element).toHaveStyle({ left: '10px', top: '10px', width: '100px' });
    expect(element).toHaveFocus();
  });

  it('should dispatch the live typed content while editing', () => {
    // mock
    const store = createTestStore();

    store.dispatch(startTextEdit({ height: 20, width: 100, x: 10, y: 10 }));

    const { container } = renderWithStore(store);
    const element = container.querySelector('[contenteditable="true"]') as HTMLDivElement;

    // jsdom doesn't implement innerText, simulate the typed content directly
    Object.defineProperty(element, 'innerText', { configurable: true, value: 'hi' });

    // action
    fireEvent.input(element);

    // result
    expect(store.getState().design.editingTextContent).toBe('hi');
  });

  it('should stop editing when the editable box loses focus', () => {
    // mock
    const store = createTestStore();

    store.dispatch(startTextEdit({ height: 20, width: 100, x: 10, y: 10 }));

    const { container } = renderWithStore(store);
    const element = container.querySelector('[contenteditable="true"]') as HTMLDivElement;

    // jsdom doesn't implement innerText, simulate the typed content directly
    Object.defineProperty(element, 'innerText', { configurable: true, value: 'hello world' });

    // action
    fireEvent.blur(element);

    // result
    expect(store.getState().design.editingTextBox).toBeNull();
  });
});
