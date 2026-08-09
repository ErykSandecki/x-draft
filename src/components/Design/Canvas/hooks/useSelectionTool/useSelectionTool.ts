import { RefObject, useEffect, useRef } from 'react';

// store
import { setSelection, updateNode } from 'store/design/slice';
import { selectActiveTool, selectOrderedNodes, selectViewport } from 'store/design/selectors';
import { store, useAppDispatch, useAppSelector } from 'store';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { TArmEndpointDrag, TLineEndpoint, TPendingClickAction } from './types';
import { TDraftRect, TPoint } from 'types/canvas';
import { TSceneNodeChanges } from 'types/design/types';

// utils
import { getCollidedNodes } from '../../utils/getCollidedNodes';
import { getPointerPosition } from '../../utils/getPointerPosition';
import { handlePointerDown } from './utils/handlePointerDown/handlePointerDown';
import { isControlPressed } from 'utils/isControlPressed';
import { screenToWorld } from '../../utils/screenToWorld';
import { toDraftRect } from '../../utils/toDraftRect';

type TNodeOrigin = { x1: number; x2: number; y1: number; y2: number } | { x: number; y: number };

type TDragState = {
  hasMoved: boolean;
  nodeOrigins: Record<string, TNodeOrigin>;
  pendingClickAction: TPendingClickAction | null;
  pointerStart: TPoint;
};

type TEndpointDragState = {
  endpoint: TLineEndpoint;
  nodeId: string;
};

export const useSelectionTool = (canvasRef: RefObject<HTMLCanvasElement | null>, marqueeRef: RefObject<TDraftRect | null>): void => {
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();
  const dragStateRef = useRef<TDragState | null>(null);
  const endpointDragRef = useRef<TEndpointDragState | null>(null);
  const marqueeStartRef = useRef<TPoint | null>(null);

  const armDrag = (armIds: string[], pendingClickAction: TPendingClickAction | null, point: TPoint): void => {
    const { nodes } = store.getState().design;

    dragStateRef.current = {
      hasMoved: false,
      nodeOrigins: Object.fromEntries(
        armIds.map((id) => {
          const node = nodes[id];

          return [id, node.type === NodeType.line ? { x1: node.x1, x2: node.x2, y1: node.y1, y2: node.y2 } : { x: node.x, y: node.y }];
        }),
      ),
      pendingClickAction,
      pointerStart: point,
    };
  };

  const armEndpointDrag: TArmEndpointDrag = (nodeId, endpoint) => {
    endpointDragRef.current = { endpoint, nodeId };
  };

  const handlePointerMove = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (dragStateRef.current) {
      const point = screenToWorld(getPointerPosition(canvas, event), selectViewport(store.getState()));
      const deltaX = point.x - dragStateRef.current.pointerStart.x;
      const deltaY = point.y - dragStateRef.current.pointerStart.y;

      dragStateRef.current.hasMoved = true;
      Object.entries(dragStateRef.current.nodeOrigins).forEach(([id, origin]) => {
        const changes: TSceneNodeChanges =
          'x1' in origin
            ? { x1: origin.x1 + deltaX, x2: origin.x2 + deltaX, y1: origin.y1 + deltaY, y2: origin.y2 + deltaY }
            : { x: origin.x + deltaX, y: origin.y + deltaY };

        dispatch(updateNode({ changes, id }));
      });
    }

    if (endpointDragRef.current) {
      const point = screenToWorld(getPointerPosition(canvas, event), selectViewport(store.getState()));
      const { endpoint, nodeId } = endpointDragRef.current;

      dispatch(updateNode({ changes: endpoint === 'a' ? { x1: point.x, y1: point.y } : { x2: point.x, y2: point.y }, id: nodeId }));
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

    if (endpointDragRef.current) {
      endpointDragRef.current = null;
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
        handlePointerDown(canvas, event, dispatch, armDrag, armEndpointDrag, marqueeStartRef);
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
