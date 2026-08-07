import { RefObject, useEffect, useRef } from 'react';

// others
import { MIN_FRAME_SIZE } from '../../constants';

// store
import { addNode, setActiveTool } from 'store/design/designSlice';
import { selectActiveTool } from 'store/design/selectors';
import { useAppDispatch, useAppSelector } from 'store';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { TDraftRect } from '../../types';
import { TPoint } from './types';

// utils
import { getPointerPosition } from './utils/getPointerPosition';
import { getRandomColor } from './utils/getRandomColor';
import { toDraftRect } from './utils/toDraftRect';

export const useFrameTool = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draftRef: RefObject<TDraftRect | null>,
): void => {
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();
  const startRef = useRef<TPoint | null>(null);

  const handlePointerDown = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    startRef.current = getPointerPosition(canvas, event);
    canvas.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (startRef.current) {
      draftRef.current = toDraftRect(startRef.current, getPointerPosition(canvas, event));
    }
  };

  const handlePointerUp = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (startRef.current) {
      const rect = toDraftRect(startRef.current, getPointerPosition(canvas, event));

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

      startRef.current = null;
      draftRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
      dispatch(setActiveTool(ToolName.default));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && activeTool === ToolName.frame) {
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
  }, [activeTool, canvasRef, dispatch, draftRef]);
};
