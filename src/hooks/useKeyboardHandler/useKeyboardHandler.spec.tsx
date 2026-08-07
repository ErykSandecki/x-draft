import { fireEvent, renderHook } from '@testing-library/react';

// hooks
import { useKeyboardHandler } from './useKeyboardHandler';

// types
import { KeyboardKeys } from 'types/enums';
import { TKeyMap } from './types';

const keyMap: TKeyMap = { action: vi.fn(), secondaryKey: KeyboardKeys.c };

describe('useKeyboardHandler behaviors', () => {
  it('should trigger action on the matching key', () => {
    // mock
    const action = vi.fn();

    // before
    renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, action }]));

    // action
    fireEvent.keyDown(window, { code: KeyboardKeys.c });

    // result
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should trigger action for anyKey regardless of the pressed key', () => {
    // mock
    const action = vi.fn();

    // before
    renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, action, anyKey: true }]));

    // action
    fireEvent.keyDown(window, { code: KeyboardKeys.f });

    // result
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should not attach a listener when attachListener is false', () => {
    // mock
    const action = vi.fn();

    // before
    renderHook(() => useKeyboardHandler(false, [], [{ ...keyMap, action }]));

    // action
    fireEvent.keyDown(window, { code: KeyboardKeys.c });

    // result
    expect(action).not.toHaveBeenCalled();
  });

  it('should scope the listener to the element matching id', () => {
    // mock
    const action = vi.fn();
    const element = document.createElement('div');

    element.setAttribute('id', 'shortcut-scope');
    document.body.appendChild(element);

    // before
    renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, action }], 'shortcut-scope'));

    // action
    fireEvent.keyDown(element, { code: KeyboardKeys.c });

    // result
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should require the exact primary key combination', () => {
    // mock
    const action = vi.fn();

    // before
    renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, action, primaryKeys: ['alt'] }]));

    // action
    fireEvent.keyDown(window, { code: KeyboardKeys.c });

    // result
    expect(action).not.toHaveBeenCalled();
  });

  it('should trigger action when the required primary key is held', () => {
    // mock
    const action = vi.fn();

    // before
    renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, action, primaryKeys: ['alt'] }]));

    // action
    fireEvent.keyDown(window, { altKey: true, code: KeyboardKeys.c });

    // result
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should not trigger action when conditions are not met', () => {
    // mock
    const action = vi.fn();

    // before
    renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, action, conditions: [false] }]));

    // action
    fireEvent.keyDown(window, { code: KeyboardKeys.c });

    // result
    expect(action).not.toHaveBeenCalled();
  });

  it('should block the browser default when lockBrowserEvents is set', () => {
    // mock
    const event = new KeyboardEvent('keydown', { code: KeyboardKeys.f, ctrlKey: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    // before
    renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, secondaryKey: KeyboardKeys.f }], undefined, true));

    // action
    window.dispatchEvent(event);

    // result
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should stop listening after unmount', () => {
    // mock
    const action = vi.fn();

    // before
    const { unmount } = renderHook(() => useKeyboardHandler(true, [], [{ ...keyMap, action }]));

    // action
    unmount();
    fireEvent.keyDown(window, { code: KeyboardKeys.c });

    // result
    expect(action).not.toHaveBeenCalled();
  });
});
