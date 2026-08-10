// store
import { setSelection } from 'store/design/slice';
import { store } from 'store';

// types
import { NodeType } from 'types/design/enums';
import { TBoxSceneNode, TPolygonNode, TSceneNode } from 'types/design/types';

// utils
import { armHitDrag } from '../armHitDrag';

const buildNode = (overrides: Partial<Exclude<TBoxSceneNode, TPolygonNode>>): TSceneNode => ({
  fill: '#ff0000',
  height: 10,
  id: 'node',
  name: 'Frame',
  parentId: null,
  rotation: 0,
  type: NodeType.frame,
  width: 10,
  x: 0,
  y: 0,
  ...overrides,
});

const createCanvasMock = (): HTMLCanvasElement => ({ setPointerCapture: vi.fn() }) as unknown as HTMLCanvasElement;

describe('armHitDrag', () => {
  beforeEach(() => {
    store.dispatch(setSelection([]));
  });

  it('should arm a collapse drag without replacing the selection when the hit node is part of a multi-selection', () => {
    // mock
    const canvas = createCanvasMock();
    const event = { pointerId: 1 } as PointerEvent;
    const armDrag = vi.fn();
    const a = buildNode({ id: 'a', x: 0, y: 0 });
    const b = buildNode({ id: 'b', x: 40, y: 0 });

    store.dispatch(setSelection(['a', 'b']));

    // before
    armHitDrag(canvas, event, store.dispatch, armDrag, a, ['a', 'b'], [a, b], { x: 5, y: 5 });

    // result
    expect(armDrag).toHaveBeenCalledWith(['a', 'b'], { id: 'a', kind: 'collapse' }, { x: 5, y: 5 });
    expect(store.getState().design.selectedIds).toEqual(['a', 'b']);
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('should arm a collapse drag without replacing the selection when the hit node is unselected but sits inside the shared group bounds', () => {
    // mock
    const canvas = createCanvasMock();
    const event = { pointerId: 2 } as PointerEvent;
    const armDrag = vi.fn();
    const a = buildNode({ id: 'a', x: 0, y: 0 });
    const b = buildNode({ id: 'b', x: 40, y: 0 });
    const c = buildNode({ id: 'c', x: 20, y: 0 });

    store.dispatch(setSelection(['a', 'b']));

    // before
    armHitDrag(canvas, event, store.dispatch, armDrag, c, ['a', 'b'], [a, b], { x: 25, y: 5 });

    // result
    expect(armDrag).toHaveBeenCalledWith(['a', 'b'], { id: 'c', kind: 'collapse' }, { x: 25, y: 5 });
    expect(store.getState().design.selectedIds).toEqual(['a', 'b']);
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(2);
  });

  it('should replace the selection and arm a plain drag when the hit node is unselected and outside the shared group bounds', () => {
    // mock
    const canvas = createCanvasMock();
    const event = { pointerId: 3 } as PointerEvent;
    const armDrag = vi.fn();
    const a = buildNode({ id: 'a', x: 0, y: 0 });
    const b = buildNode({ id: 'b', x: 40, y: 0 });
    const c = buildNode({ id: 'c', x: 100, y: 100 });

    store.dispatch(setSelection(['a', 'b']));

    // before
    armHitDrag(canvas, event, store.dispatch, armDrag, c, ['a', 'b'], [a, b], { x: 105, y: 105 });

    // result
    expect(store.getState().design.selectedIds).toEqual(['c']);
    expect(armDrag).toHaveBeenCalledWith(['c'], null, { x: 105, y: 105 });
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(3);
  });
});
