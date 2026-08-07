// store
import { setSelection } from 'store/design/slice';
import { selectOrderedNodes, selectSelectedIds, selectSelectedNodes, selectViewport } from 'store/design/selectors';
import { AppDispatch, store } from 'store';

// types
import { TArmDrag } from '../../types';

// utils
import { armGroupBoundsDrag } from './armGroupBoundsDrag';
import { armHitDrag } from './armHitDrag';
import { getNodeAtPoint } from '../getNodeAtPoint';
import { getPointerPosition } from '../../../../utils/getPointerPosition';
import { isPointInGroupBounds } from '../isPointInGroupBounds';
import { screenToWorld } from '../../../../utils/screenToWorld';
import { toggleSelection } from '../toggleSelection';

const PRIMARY_MOUSE_BUTTON = 0;

export const handlePointerDown = (
  canvas: HTMLCanvasElement,
  event: PointerEvent,
  dispatch: AppDispatch,
  armDrag: TArmDrag,
): void => {
  if (event.button === PRIMARY_MOUSE_BUTTON) {
    const state = store.getState();
    const point = screenToWorld(getPointerPosition(canvas, event), selectViewport(state));
    const hit = getNodeAtPoint(point, selectOrderedNodes(state));
    const currentSelection = selectSelectedIds(state);
    const selectedNodes = selectSelectedNodes(state);

    if (hit && event.shiftKey) {
      dispatch(setSelection(toggleSelection(currentSelection, hit.id)));
    } else if (hit) {
      armHitDrag(canvas, event, dispatch, armDrag, hit, currentSelection, selectedNodes, point);
    } else if (!event.shiftKey && isPointInGroupBounds(point, selectedNodes)) {
      armGroupBoundsDrag(canvas, event, armDrag, currentSelection, point);
    } else if (!event.shiftKey) {
      dispatch(setSelection([]));
    }
  }
};
