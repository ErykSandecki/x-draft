import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { InputEvent } from 'react';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';

// hooks
import { useTextEditInput } from '../useTextEditInput';

// store
import designReducer from 'store/design/slice';
import { TDesignState } from 'store/design/types';

const createTestStore = (): EnhancedStore<{ design: TDesignState }> => configureStore({ reducer: { design: designReducer } });

const createInputEvent = (innerText: string): InputEvent<HTMLDivElement> =>
  ({ currentTarget: { innerText } as HTMLDivElement }) as InputEvent<HTMLDivElement>;

describe('useTextEditInput behaviors', () => {
  it('should dispatch the live typed content', () => {
    // mock
    const store = createTestStore();

    // before
    const { result } = renderHook(() => useTextEditInput(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    // action
    result.current(createInputEvent('hello'));

    // result
    expect(store.getState().design.editingTextContent).toBe('hello');
  });
});
