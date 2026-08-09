import { RefObject } from 'react';

// store
import { addNode, setSelection } from 'store/design/slice';
import { store } from 'store';

// types
import { NodeType } from 'types/design/enums';
import { TPoint } from 'types/canvas';

// utils
import { handlePointerDown } from '../handlePointerDown';

const createCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');

  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0 } as DOMRect);
  canvas.setPointerCapture = vi.fn();

  return canvas;
};

const pointerEvent = (x: number, y: number, options: Partial<PointerEventInit> = {}): PointerEvent =>
  new PointerEvent('pointerdown', { button: 0, clientX: x, clientY: y, pointerId: 1, ...options });

const createMarqueeStartRef = (): RefObject<TPoint | null> => ({ current: null });

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

const addLineNode = (x1: number, y1: number, x2: number, y2: number): string => {
  store.dispatch(addNode({ name: 'Line', parentId: null, stroke: '#000000', type: NodeType.line, x1, x2, y1, y2 }));

  const { rootOrder } = store.getState().design;

  return rootOrder[rootOrder.length - 1];
};

describe('handlePointerDown', () => {
  beforeEach(() => {
    store.dispatch(setSelection([]));
  });

  it('should ignore a non-primary button press', () => {
    // mock
    const canvas = createCanvas();
    const armDrag = vi.fn();
    const marqueeStartRef = createMarqueeStartRef();

    // before
    handlePointerDown(canvas, pointerEvent(10, 10, { button: 1 }), store.dispatch, armDrag, vi.fn(), marqueeStartRef);

    // result
    expect(armDrag).not.toHaveBeenCalled();
    expect(store.getState().design.selectedIds).toEqual([]);
  });

  it('should toggle the hit node into the selection on shift-click', () => {
    // mock
    const idA = addFrameNode(100, 100);
    const canvas = createCanvas();
    const armDrag = vi.fn();
    const marqueeStartRef = createMarqueeStartRef();

    // before
    handlePointerDown(canvas, pointerEvent(105, 105, { shiftKey: true }), store.dispatch, armDrag, vi.fn(), marqueeStartRef);

    // result
    expect(store.getState().design.selectedIds).toEqual([idA]);
    expect(armDrag).not.toHaveBeenCalled();
  });

  it('should delegate to armHitDrag when the pointer hits a node', () => {
    // mock
    const idA = addFrameNode(200, 200);
    const canvas = createCanvas();
    const armDrag = vi.fn();
    const marqueeStartRef = createMarqueeStartRef();

    // before
    handlePointerDown(canvas, pointerEvent(205, 205), store.dispatch, armDrag, vi.fn(), marqueeStartRef);

    // result
    expect(store.getState().design.selectedIds).toEqual([idA]);
    expect(armDrag).toHaveBeenCalledWith([idA], null, expect.anything());
  });

  it('should delegate to armGroupBoundsDrag when clicking the gap inside a shared multi-selection', () => {
    // mock
    const idA = addFrameNode(300, 300, 20);
    const idB = addFrameNode(360, 300, 20);

    store.dispatch(setSelection([idA, idB]));

    const canvas = createCanvas();
    const armDrag = vi.fn();
    const marqueeStartRef = createMarqueeStartRef();

    // before
    handlePointerDown(canvas, pointerEvent(340, 310), store.dispatch, armDrag, vi.fn(), marqueeStartRef);

    // result
    expect(armDrag).toHaveBeenCalledWith([idA, idB], { kind: 'deselect' }, expect.anything());
  });

  it('should clear the selection and arm the marquee when clicking empty canvas', () => {
    // mock
    const idA = addFrameNode(400, 400);

    store.dispatch(setSelection([idA]));

    const canvas = createCanvas();
    const armDrag = vi.fn();
    const marqueeStartRef = createMarqueeStartRef();

    // before
    handlePointerDown(canvas, pointerEvent(900, 900), store.dispatch, armDrag, vi.fn(), marqueeStartRef);

    // result
    expect(store.getState().design.selectedIds).toEqual([]);
    expect(armDrag).not.toHaveBeenCalled();
    expect(marqueeStartRef.current).not.toBeNull();
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('should delegate to armEndpointDrag when a selected line endpoint is hit, instead of moving the whole shape', () => {
    // mock
    const idA = addLineNode(500, 500, 600, 500);

    store.dispatch(setSelection([idA]));

    const canvas = createCanvas();
    const armDrag = vi.fn();
    const armEndpointDrag = vi.fn();
    const marqueeStartRef = createMarqueeStartRef();

    // before
    handlePointerDown(canvas, pointerEvent(500, 500), store.dispatch, armDrag, armEndpointDrag, marqueeStartRef);

    // result
    expect(armEndpointDrag).toHaveBeenCalledWith(idA, 'a');
    expect(armDrag).not.toHaveBeenCalled();
  });

  it('should fall back to a whole-shape move when the line is selected but the hit is not near an endpoint', () => {
    // mock
    const idA = addLineNode(700, 700, 800, 700);

    store.dispatch(setSelection([idA]));

    const canvas = createCanvas();
    const armDrag = vi.fn();
    const armEndpointDrag = vi.fn();
    const marqueeStartRef = createMarqueeStartRef();

    // before
    handlePointerDown(canvas, pointerEvent(750, 700), store.dispatch, armDrag, armEndpointDrag, marqueeStartRef);

    // result
    expect(armEndpointDrag).not.toHaveBeenCalled();
    expect(armDrag).toHaveBeenCalledWith([idA], null, expect.anything());
  });
});
