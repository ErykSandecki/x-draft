import { RefObject, useEffect, useRef } from 'react';

// others
import { MIN_SHAPE_SIZE, RECTANGLE_FILL } from '../../constants';

// store
import { addNode, setActiveTool, setSelection } from 'store/design/slice';
import { selectActiveTool, selectViewport } from 'store/design/selectors';
import { useAppDispatch, useAppSelector } from 'store';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { MouseButton } from 'types/enums';
import { TDraftRect, TPoint } from 'types/canvas';

// utils
import { getPointerPosition } from '../../utils/getPointerPosition';
import { screenToWorld } from '../../utils/screenToWorld';
import { toDraftRect } from '../../utils/toDraftRect';

export const useRectangleTool = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draftRef: RefObject<TDraftRect | null>,
): void => {
  const activeTool = useAppSelector(selectActiveTool);
  const viewport = useAppSelector(selectViewport);
  const dispatch = useAppDispatch();
  const startRef = useRef<TPoint | null>(null);

  const handlePointerDown = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (event.button === MouseButton.primary) {
      dispatch(setSelection([]));
      startRef.current = screenToWorld(getPointerPosition(canvas, event), viewport);
      canvas.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (startRef.current) {
      draftRef.current = toDraftRect(startRef.current, screenToWorld(getPointerPosition(canvas, event), viewport));
    }
  };

  const handlePointerUp = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (startRef.current) {
      const rect = toDraftRect(startRef.current, screenToWorld(getPointerPosition(canvas, event), viewport));

      if (rect.width >= MIN_SHAPE_SIZE && rect.height >= MIN_SHAPE_SIZE) {
        dispatch(
          addNode({
            ...rect,
            fill: RECTANGLE_FILL,
            name: 'Rectangle',
            parentId: null,
            rotation: 0,
            type: NodeType.rectangle,
          }),
        );
      }

      startRef.current = null;
      draftRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
      dispatch(setActiveTool(ToolName.default));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && activeTool === ToolName.rectangle) {
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
  }, [activeTool, canvasRef, dispatch, draftRef, viewport]);
};
