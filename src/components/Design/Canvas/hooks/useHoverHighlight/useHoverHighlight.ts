import { RefObject, useEffect } from 'react';

// store
import { selectActiveTool, selectOrderedNodes, selectViewport } from 'store/design/selectors';
import { store, useAppSelector } from 'store';

// types
import { ToolName } from 'types/design/enums';

// utils
import { getNodeAtPoint } from '../../utils/getNodeAtPoint';
import { getPointerPosition } from '../../utils/getPointerPosition';
import { screenToWorld } from '../../utils/screenToWorld';

export const useHoverHighlight = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  hoverRef: RefObject<string | null>,
): void => {
  const activeTool = useAppSelector(selectActiveTool);

  const handlePointerMove = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (event.buttons === 0) {
      const state = store.getState();
      const point = screenToWorld(getPointerPosition(canvas, event), selectViewport(state));
      const hit = getNodeAtPoint(point, selectOrderedNodes(state));

      hoverRef.current = hit?.id ?? null;
    }
  };

  const handlePointerLeave = (): void => {
    hoverRef.current = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && activeTool === ToolName.default) {
      const onPointerMove = (event: PointerEvent): void => handlePointerMove(canvas, event);
      const onPointerLeave = (): void => handlePointerLeave();

      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerleave', onPointerLeave);

      return (): void => {
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerleave', onPointerLeave);
        hoverRef.current = null;
      };
    }
  }, [activeTool, canvasRef, hoverRef]);
};
