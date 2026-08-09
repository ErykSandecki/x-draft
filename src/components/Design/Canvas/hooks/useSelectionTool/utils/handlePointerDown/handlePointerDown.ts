import { RefObject } from 'react';

// store
import { setSelection } from 'store/design/slice';
import { selectOrderedNodes, selectSelectedIds, selectSelectedNodes, selectViewport } from 'store/design/selectors';
import { AppDispatch, store } from 'store';

// types
import { TArmDrag, TArmEndpointDrag } from '../../types';
import { MouseButton } from 'types/enums';
import { TPoint } from 'types/canvas';

// utils
import { armGroupBoundsDrag } from './armGroupBoundsDrag';
import { armHitDrag } from './armHitDrag';
import { armLineEndpointDrag } from './armLineEndpointDrag';
import { armMarqueeDrag } from './armMarqueeDrag';
import { getLineEndpointAtPoint } from '../../../../utils/getLineEndpointAtPoint';
import { getNodeAtPoint } from '../../../../utils/getNodeAtPoint';
import { getPointerPosition } from '../../../../utils/getPointerPosition';
import { isPointInGroupBounds } from '../isPointInGroupBounds';
import { screenToWorld } from '../../../../utils/screenToWorld';
import { toggleSelection } from '../toggleSelection';

export const handlePointerDown = (
  canvas: HTMLCanvasElement,
  event: PointerEvent,
  dispatch: AppDispatch,
  armDrag: TArmDrag,
  armEndpointDrag: TArmEndpointDrag,
  marqueeStartRef: RefObject<TPoint | null>,
): void => {
  if (event.button === MouseButton.primary) {
    const state = store.getState();
    const viewport = selectViewport(state);
    const point = screenToWorld(getPointerPosition(canvas, event), viewport);
    const hit = getNodeAtPoint(point, selectOrderedNodes(state), viewport);
    const currentSelection = selectSelectedIds(state);
    const selectedNodes = selectSelectedNodes(state);
    const lineEndpointHit = getLineEndpointAtPoint(point, selectedNodes, viewport);

    if (lineEndpointHit && !event.shiftKey) {
      armLineEndpointDrag(canvas, event, armEndpointDrag, lineEndpointHit.nodeId, lineEndpointHit.endpoint);
    } else if (hit && event.shiftKey) {
      dispatch(setSelection(toggleSelection(currentSelection, hit.id)));
    } else if (hit) {
      armHitDrag(canvas, event, dispatch, armDrag, hit, currentSelection, selectedNodes, point);
    } else if (!event.shiftKey && isPointInGroupBounds(point, selectedNodes)) {
      armGroupBoundsDrag(canvas, event, armDrag, currentSelection, point);
    } else if (!event.shiftKey) {
      armMarqueeDrag(canvas, event, dispatch, marqueeStartRef, point);
    }
  }
};
