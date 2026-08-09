import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

// hooks
import { useToolbarShortcuts } from './useToolbarShortcuts';

// store
import designReducer, { setActiveTool } from 'store/design/slice';
import { TDesignState } from 'store/design/types';

// types
import { ToolName } from 'types/design/enums';

const createTestStore = (): EnhancedStore<{ design: TDesignState }> => configureStore({ reducer: { design: designReducer } });

const renderShortcuts = (store: EnhancedStore<{ design: TDesignState }>): void => {
  renderHook(() => useToolbarShortcuts(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe('useToolbarShortcuts behaviors', () => {
  it('should switch to the frame tool on "F"', () => {
    // mock
    const store = createTestStore();

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyF' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.frame);
  });

  it('should switch to the rectangle tool on "R"', () => {
    // mock
    const store = createTestStore();

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyR' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.rectangle);
  });

  it('should switch to the line tool on "L"', () => {
    // mock
    const store = createTestStore();

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyL' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.line);
  });

  it('should switch to the ellipse tool on "O"', () => {
    // mock
    const store = createTestStore();

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyO' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.ellipse);
  });

  it('should switch to the comment tool on "C"', () => {
    // mock
    const store = createTestStore();

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyC' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.comment);
  });

  it('should switch back to the default tool on "V"', () => {
    // mock
    const store = createTestStore();

    store.dispatch(setActiveTool(ToolName.frame));

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyV' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.default);
  });

  it('should switch back to the default tool on "Escape"', () => {
    // mock
    const store = createTestStore();

    store.dispatch(setActiveTool(ToolName.frame));

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'Escape' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.default);
  });

  it('should ignore unrelated keys', () => {
    // mock
    const store = createTestStore();

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyZ' });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.default);
  });

  it('should not trigger a shortcut while a modifier key is held', () => {
    // mock
    const store = createTestStore();

    // before
    renderShortcuts(store);

    // action
    fireEvent.keyDown(window, { code: 'KeyF', metaKey: true });

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.default);
  });
});
