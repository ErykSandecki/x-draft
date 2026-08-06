import { RefObject, useEffect } from 'react';

// others
import { MIN_FRAME_SIZE } from '../constants';

// store
import { addNode, setActiveTool } from 'store/design/designSlice';
import { selectActiveTool } from 'store/design/selectors';
import { useAppDispatch, useAppSelector } from 'store';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { TDraftRect } from '../types';

// utils
import { getRandomColor } from '../utils/getRandomColor';

type TPoint = {
  x: number;
  y: number;
};

const getPointerPosition = (canvas: HTMLCanvasElement, event: PointerEvent): TPoint => {
  const rect = canvas.getBoundingClientRect();

  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
};

const toDraftRect = (start: TPoint, current: TPoint): TDraftRect => ({
  height: Math.abs(current.y - start.y),
  width: Math.abs(current.x - start.x),
  x: Math.min(start.x, current.x),
  y: Math.min(start.y, current.y),
});

export const useFrameTool = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draftRef: RefObject<TDraftRect | null>,
): void => {
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && activeTool === ToolName.frame) {
      let start: TPoint | null = null;

      const handlePointerDown = (event: PointerEvent): void => {
        start = getPointerPosition(canvas, event);
        canvas.setPointerCapture(event.pointerId);
      };

      const handlePointerMove = (event: PointerEvent): void => {
        if (start) {
          draftRef.current = toDraftRect(start, getPointerPosition(canvas, event));
        }
      };

      const handlePointerUp = (event: PointerEvent): void => {
        if (start) {
          const rect = toDraftRect(start, getPointerPosition(canvas, event));

          if (rect.width >= MIN_FRAME_SIZE && rect.height >= MIN_FRAME_SIZE) {
            dispatch(
              addNode({
                ...rect,
                fill: getRandomColor(),
                name: 'Frame',
                parentId: null,
                rotation: 0,
                type: NodeType.frame,
              }),
            );
          }

          start = null;
          draftRef.current = null;
          canvas.releasePointerCapture(event.pointerId);
          dispatch(setActiveTool(ToolName.default));
        }
      };

      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);

      return (): void => {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [activeTool, canvasRef, dispatch, draftRef]);
};
