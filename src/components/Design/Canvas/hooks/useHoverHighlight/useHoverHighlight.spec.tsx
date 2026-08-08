import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import { RefObject } from 'react';

// hooks
import { useHoverHighlight } from './useHoverHighlight';

// store
import { addNode, setActiveTool } from 'store/design/slice';
import { store } from 'store';

// types
import { NodeType, ToolName } from 'types/design/enums';

const createCanvasRef = (): RefObject<HTMLCanvasElement | null> => {
  const canvas = document.createElement('canvas');

  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0 } as DOMRect);

  return { current: canvas };
};

const pointerEvent = (type: string, x: number, y: number, options: Partial<PointerEventInit> = {}): PointerEvent =>
  new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, ...options });

const addFrameNode = (x: number, y: number, size = 20): string => {
  store.dispatch(
    addNode({
      fill: '#ff0000',
      height: size,
      name: 'Frame',
      parentId: null,
      rotation: 0,
      type: NodeType.frame,
      width: size,
      x,
      y,
    }),
  );

  const { rootOrder } = store.getState().design;

  return rootOrder[rootOrder.length - 1];
};

const renderHoverHighlight = (canvasRef: RefObject<HTMLCanvasElement | null>): RefObject<string | null> => {
  const hoverRef: RefObject<string | null> = { current: null };

  renderHook(() => useHoverHighlight(canvasRef, hoverRef), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

  return hoverRef;
};

describe('useHoverHighlight behaviors', () => {
  beforeEach(() => {
    store.dispatch(setActiveTool(ToolName.default));
  });

  it('should not react to pointer events when the default tool is not active', () => {
    // mock
    store.dispatch(setActiveTool(ToolName.frame));

    const idA = addFrameNode(0, 0);
    const canvasRef = createCanvasRef();

    // before
    const hoverRef = renderHoverHighlight(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 5, 5));

    // result
    expect(hoverRef.current).toBeNull();
    expect(idA).toBeTruthy();
  });

  it('should set the hovered node id when the pointer moves over a node', () => {
    // mock
    const idA = addFrameNode(100, 100);
    const canvasRef = createCanvasRef();

    // before
    const hoverRef = renderHoverHighlight(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 110, 110));

    // result
    expect(hoverRef.current).toBe(idA);
  });

  it('should clear the hovered node id when the pointer moves over empty canvas', () => {
    // mock
    const idA = addFrameNode(200, 200);
    const canvasRef = createCanvasRef();

    // before
    const hoverRef = renderHoverHighlight(canvasRef);

    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 205, 205));
    expect(hoverRef.current).toBe(idA);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 900, 900));

    // result
    expect(hoverRef.current).toBeNull();
  });

  it('should clear the hovered node id when the pointer leaves the canvas', () => {
    // mock
    const idA = addFrameNode(300, 300);
    const canvasRef = createCanvasRef();

    // before
    const hoverRef = renderHoverHighlight(canvasRef);

    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 305, 305));
    expect(hoverRef.current).toBe(idA);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerleave', 305, 305));

    // result
    expect(hoverRef.current).toBeNull();
  });

  it('should ignore pointer moves while a button is held (mid-drag elsewhere)', () => {
    // mock
    addFrameNode(400, 400);

    const canvasRef = createCanvasRef();

    // before
    const hoverRef = renderHoverHighlight(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 405, 405, { buttons: 1 }));

    // result
    expect(hoverRef.current).toBeNull();
  });
});
