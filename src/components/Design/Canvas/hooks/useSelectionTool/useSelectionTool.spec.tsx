import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import { RefObject } from 'react';

// hooks
import { useSelectionTool } from './useSelectionTool';

// store
import { addNode, setActiveTool, setSelection } from 'store/design/designSlice';
import { store } from 'store';

// types
import { NodeType, ToolName } from 'types/design/enums';

const createCanvasRef = (): RefObject<HTMLCanvasElement | null> => {
  const canvas = document.createElement('canvas');

  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0 } as DOMRect);

  // jsdom doesn't implement pointer capture on elements
  canvas.setPointerCapture = vi.fn();
  canvas.releasePointerCapture = vi.fn();

  return { current: canvas };
};

const pointerEvent = (type: string, x: number, y: number, options: Partial<PointerEventInit> = {}): PointerEvent =>
  new PointerEvent(type, { button: 0, clientX: x, clientY: y, pointerId: 1, ...options });

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

const renderSelectionTool = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  renderHook(() => useSelectionTool(canvasRef), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe('useSelectionTool behaviors', () => {
  beforeEach(() => {
    store.dispatch(setActiveTool(ToolName.default));
    store.dispatch(setSelection([]));
  });

  it('should not react to pointer events when the default tool is not active', () => {
    // mock
    store.dispatch(setActiveTool(ToolName.frame));

    const idA = addFrameNode(0, 0);
    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 10, 10));

    // result
    expect(store.getState().design.selectedIds).toEqual([]);
    expect(idA).toBeTruthy();
  });

  it('should select an unselected node on a plain click', () => {
    // mock
    const idA = addFrameNode(100, 100);
    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 110, 110));

    // result
    expect(store.getState().design.selectedIds).toEqual([idA]);
  });

  it('should deselect everything when clicking empty canvas', () => {
    // mock
    const idA = addFrameNode(200, 200);

    store.dispatch(setSelection([idA]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 900, 900));

    // result
    expect(store.getState().design.selectedIds).toEqual([]);
  });

  it('should not change the selection when shift-clicking empty canvas', () => {
    // mock
    const idA = addFrameNode(210, 210);

    store.dispatch(setSelection([idA]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 950, 950, { shiftKey: true }));

    // result
    expect(store.getState().design.selectedIds).toEqual([idA]);
  });

  it('should add an unselected node to the selection on shift-click', () => {
    // mock
    const idA = addFrameNode(300, 300);
    const idB = addFrameNode(340, 300);

    store.dispatch(setSelection([idA]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 345, 305, { shiftKey: true }));

    // result
    expect(store.getState().design.selectedIds).toEqual([idA, idB]);
  });

  it('should remove an already-selected node on shift-click', () => {
    // mock
    const idA = addFrameNode(400, 400);
    const idB = addFrameNode(440, 400);

    store.dispatch(setSelection([idA, idB]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 405, 405, { shiftKey: true }));

    // result
    expect(store.getState().design.selectedIds).toEqual([idB]);
  });

  it('should replace the selection when plain-clicking a node that was never selected', () => {
    // mock
    const idA = addFrameNode(500, 500);
    const idB = addFrameNode(540, 500);
    const idC = addFrameNode(580, 500);

    store.dispatch(setSelection([idA, idB]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 585, 505));

    // result
    expect(store.getState().design.selectedIds).toEqual([idC]);
  });

  it('should collapse a multi-selection to the clicked node when released without moving', () => {
    // mock
    const idA = addFrameNode(600, 600);
    const idB = addFrameNode(640, 600);

    store.dispatch(setSelection([idA, idB]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 605, 605));
    canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 605, 605));

    // result
    expect(store.getState().design.selectedIds).toEqual([idA]);
  });

  it('should keep the multi-selection and move every node together when dragged', () => {
    // mock
    const idA = addFrameNode(700, 700);
    const idB = addFrameNode(740, 700);

    store.dispatch(setSelection([idA, idB]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 705, 705));
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 715, 715));
    canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 715, 715));

    // result
    const { nodes, selectedIds } = store.getState().design;

    expect(selectedIds).toEqual([idA, idB]);
    expect(nodes[idA]).toMatchObject({ x: 710, y: 710 });
    expect(nodes[idB]).toMatchObject({ x: 750, y: 710 });
  });

  it('should move a single selected node while dragging', () => {
    // mock
    const idA = addFrameNode(800, 800);

    store.dispatch(setSelection([idA]));

    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 805, 805));
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 825, 815));

    // result
    expect(store.getState().design.nodes[idA]).toMatchObject({ x: 820, y: 810 });
  });

  it('should ignore a non-primary button press', () => {
    // mock
    const idA = addFrameNode(900, 900);
    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 905, 905, { button: 1 }));

    // result
    expect(store.getState().design.selectedIds).toEqual([]);
    expect(idA).toBeTruthy();
  });

  it('should ignore pointer-move while no drag is armed', () => {
    // mock
    const idA = addFrameNode(1000, 1000);
    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    expect(() => canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 1005, 1005))).not.toThrow();

    // result
    expect(store.getState().design.nodes[idA]).toMatchObject({ x: 1000, y: 1000 });
  });

  it('should ignore a pointer-up that was not preceded by a pointer-down', () => {
    // mock
    const canvasRef = createCanvasRef();

    // before
    renderSelectionTool(canvasRef);

    // action
    expect(() => canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 10, 10))).not.toThrow();

    // result
    expect(store.getState().design.selectedIds).toEqual([]);
  });
});
