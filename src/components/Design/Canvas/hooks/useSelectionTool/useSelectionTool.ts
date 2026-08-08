import { RefObject, useEffect, useRef } from 'react';

// store
import { setSelection, updateNode } from 'store/design/slice';
import { selectActiveTool, selectOrderedNodes, selectViewport } from 'store/design/selectors';
import { store, useAppDispatch, useAppSelector } from 'store';

// types
import { ToolName } from 'types/design/enums';
import { TPendingClickAction } from './types';
import { TDraftRect, TPoint } from 'types/canvas';

// utils
import { getCollidedNodes } from '../../utils/getCollidedNodes';
import { getPointerPosition } from '../../utils/getPointerPosition';
import { handlePointerDown } from './utils/handlePointerDown/handlePointerDown';
import { isControlPressed } from 'utils/isControlPressed';
import { screenToWorld } from '../../utils/screenToWorld';
import { toDraftRect } from '../../utils/toDraftRect';

type TDragState = {
  hasMoved: boolean;
  nodeOrigins: Record<string, TPoint>;
  pendingClickAction: TPendingClickAction | null;
  pointerStart: TPoint;
};

export const useSelectionTool = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  marqueeRef: RefObject<TDraftRect | null>,
): void => {
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();
  const dragStateRef = useRef<TDragState | null>(null);
  const marqueeStartRef = useRef<TPoint | null>(null);

  const armDrag = (armIds: string[], pendingClickAction: TPendingClickAction | null, point: TPoint): void => {
    const { nodes } = store.getState().design;

    dragStateRef.current = {
      hasMoved: false,
      nodeOrigins: Object.fromEntries(armIds.map((id) => [id, { x: nodes[id].x, y: nodes[id].y }])),
      pendingClickAction,
      pointerStart: point,
    };
  };

  const handlePointerMove = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (dragStateRef.current) {
      const point = screenToWorld(getPointerPosition(canvas, event), selectViewport(store.getState()));
      const deltaX = point.x - dragStateRef.current.pointerStart.x;
      const deltaY = point.y - dragStateRef.current.pointerStart.y;

      dragStateRef.current.hasMoved = true;
      Object.entries(dragStateRef.current.nodeOrigins).forEach(([id, origin]) => {
        dispatch(updateNode({ changes: { x: origin.x + deltaX, y: origin.y + deltaY }, id }));
      });
    }

    if (marqueeStartRef.current) {
      const state = store.getState();
      const point = screenToWorld(getPointerPosition(canvas, event), selectViewport(state));
      const rect = toDraftRect(marqueeStartRef.current, point);
      const collidedNodes = getCollidedNodes(selectOrderedNodes(state), rect, isControlPressed(event));

      marqueeRef.current = rect;
      dispatch(setSelection(collidedNodes.map(({ id }) => id)));
    }
  };

  const handlePointerUp = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (dragStateRef.current) {
      const { hasMoved, pendingClickAction } = dragStateRef.current;

      if (pendingClickAction?.kind === 'collapse' && !hasMoved) {
        dispatch(setSelection([pendingClickAction.id]));
      } else if (pendingClickAction?.kind === 'deselect' && !hasMoved) {
        dispatch(setSelection([]));
      }

      dragStateRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
    }

    if (marqueeStartRef.current) {
      marqueeStartRef.current = null;
      marqueeRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && activeTool === ToolName.default) {
      const onPointerDown = (event: PointerEvent): void =>
        handlePointerDown(canvas, event, dispatch, armDrag, marqueeStartRef);
      const onPointerMove = (event: PointerEvent): void => handlePointerMove(canvas, event);
      const onPointerUp = (event: PointerEvent): void => handlePointerUp(canvas, event);

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);

      return (): void => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
      };
    }
  }, [activeTool, canvasRef, dispatch, marqueeRef]);
};
