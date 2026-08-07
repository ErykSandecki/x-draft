import { RefObject, useEffect, useRef } from 'react';

// store
import { setSelection, updateNode } from 'store/design/slice';
import { selectActiveTool, selectOrderedNodes, selectSelectedIds, selectViewport } from 'store/design/selectors';
import { store, useAppDispatch, useAppSelector } from 'store';

// types
import { ToolName } from 'types/design/enums';
import { TPoint } from '../../types';

// utils
import { getNodeAtPoint } from './utils/getNodeAtPoint';
import { getPointerPosition } from '../../utils/getPointerPosition';
import { screenToWorld } from '../../utils/screenToWorld';
import { toggleSelection } from './utils/toggleSelection';

const PRIMARY_MOUSE_BUTTON = 0;

type TDragState = {
  hasMoved: boolean;
  nodeOrigins: Record<string, TPoint>;
  pendingSelectionId: string | null;
  pointerStart: TPoint;
};

export const useSelectionTool = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();
  const dragStateRef = useRef<TDragState | null>(null);

  const armDrag = (armIds: string[], pendingSelectionId: string | null, point: TPoint): void => {
    const { nodes } = store.getState().design;

    dragStateRef.current = {
      hasMoved: false,
      nodeOrigins: Object.fromEntries(armIds.map((id) => [id, { x: nodes[id].x, y: nodes[id].y }])),
      pendingSelectionId,
      pointerStart: point,
    };
  };

  const handlePointerDown = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (event.button === PRIMARY_MOUSE_BUTTON) {
      const state = store.getState();
      const point = screenToWorld(getPointerPosition(canvas, event), selectViewport(state));
      const hit = getNodeAtPoint(point, selectOrderedNodes(state));
      const currentSelection = selectSelectedIds(state);

      if (hit && event.shiftKey) {
        dispatch(setSelection(toggleSelection(currentSelection, hit.id)));
      } else if (hit) {
        const isPartOfMultiSelection = currentSelection.length > 1 && currentSelection.includes(hit.id);

        if (isPartOfMultiSelection) {
          armDrag(currentSelection, hit.id, point);
        } else {
          dispatch(setSelection([hit.id]));
          armDrag([hit.id], null, point);
        }

        canvas.setPointerCapture(event.pointerId);
      } else if (!event.shiftKey) {
        dispatch(setSelection([]));
      }
    }
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
  };

  const handlePointerUp = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (dragStateRef.current) {
      if (dragStateRef.current.pendingSelectionId && !dragStateRef.current.hasMoved) {
        dispatch(setSelection([dragStateRef.current.pendingSelectionId]));
      }

      dragStateRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && activeTool === ToolName.default) {
      const onPointerDown = (event: PointerEvent): void => handlePointerDown(canvas, event);
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
  }, [activeTool, canvasRef, dispatch]);
};
