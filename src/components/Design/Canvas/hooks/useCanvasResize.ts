import { RefObject, useEffect } from 'react';

// utils
import { resizeCanvas } from '../utils/resizeCanvas';

export const useCanvasResize = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      resizeCanvas(canvas);

      const resizeObserver = new ResizeObserver(() => resizeCanvas(canvas));
      resizeObserver.observe(canvas);

      return (): void => resizeObserver.disconnect();
    }
  }, [canvasRef]);
};
