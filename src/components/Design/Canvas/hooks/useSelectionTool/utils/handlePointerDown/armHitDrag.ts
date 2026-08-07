// store
import { setSelection } from 'store/design/slice';
import { AppDispatch } from 'store';

// types
import { TArmDrag } from '../../types';
import { TPoint } from 'types/canvas';
import { TSceneNode } from 'types/design/types';

// utils
import { isPointInGroupBounds } from '../isPointInGroupBounds';

export const armHitDrag = (
  canvas: HTMLCanvasElement,
  event: PointerEvent,
  dispatch: AppDispatch,
  armDrag: TArmDrag,
  hit: TSceneNode,
  currentSelection: string[],
  selectedNodes: TSceneNode[],
  point: TPoint,
): void => {
  const isPartOfMultiSelection = currentSelection.length > 1 && currentSelection.includes(hit.id);

  if (isPartOfMultiSelection || isPointInGroupBounds(point, selectedNodes)) {
    armDrag(currentSelection, { id: hit.id, kind: 'collapse' }, point);
  } else {
    dispatch(setSelection([hit.id]));
    armDrag([hit.id], null, point);
  }

  canvas.setPointerCapture(event.pointerId);
};
