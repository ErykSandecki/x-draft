// types
import { TArmDrag } from '../../types';
import { TPoint } from 'types/canvas';

export const armGroupBoundsDrag = (
  canvas: HTMLCanvasElement,
  event: PointerEvent,
  armDrag: TArmDrag,
  currentSelection: string[],
  point: TPoint,
): void => {
  armDrag(currentSelection, { kind: 'deselect' }, point);
  canvas.setPointerCapture(event.pointerId);
};
