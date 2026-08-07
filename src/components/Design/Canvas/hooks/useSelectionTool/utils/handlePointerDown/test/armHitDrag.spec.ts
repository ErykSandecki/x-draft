// store
import { setSelection } from 'store/design/slice';
import { store } from 'store';

// types
import { NodeType } from 'types/design/enums';
import { TSceneNode } from 'types/design/types';

// utils
import { armHitDrag } from '../armHitDrag';

const buildNode = (overrides: Partial<TSceneNode>): TSceneNode => ({
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

const createCanvasMock = (): HTMLCanvasElement =>
  ({ setPointerCapture: vi.fn() }) as unknown as HTMLCanvasElement;

describe('armHitDrag', () => {
  beforeEach(() => {
    store.dispatch(setSelection([]));
  });

  it('should arm a collapse drag without replacing the selection when the hit node is part of a multi-selection', () => {
    // mock
    const canvas = createCanvasMock();
    const event = { pointerId: 1 } as PointerEvent;
    const armDrag = vi.fn();
    const hit = buildNode({ id: 'a' });

    store.dispatch(setSelection(['a', 'b']));

    // before
    armHitDrag(canvas, event, store.dispatch, armDrag, hit, ['a', 'b'], { x: 0, y: 0 });

    // result
    expect(armDrag).toHaveBeenCalledWith(['a', 'b'], { id: 'a', kind: 'collapse' }, { x: 0, y: 0 });
    expect(store.getState().design.selectedIds).toEqual(['a', 'b']);
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('should replace the selection and arm a plain drag when the hit node is not part of a multi-selection', () => {
    // mock
    const canvas = createCanvasMock();
    const event = { pointerId: 2 } as PointerEvent;
    const armDrag = vi.fn();
    const hit = buildNode({ id: 'c' });

    store.dispatch(setSelection(['a', 'b']));

    // before
    armHitDrag(canvas, event, store.dispatch, armDrag, hit, ['a', 'b'], { x: 5, y: 5 });

    // result
    expect(store.getState().design.selectedIds).toEqual(['c']);
    expect(armDrag).toHaveBeenCalledWith(['c'], null, { x: 5, y: 5 });
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(2);
  });
});
