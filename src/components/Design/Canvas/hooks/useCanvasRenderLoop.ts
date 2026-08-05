import { RefObject, useEffect } from 'react';

// others
import { WEBGL_CONTEXT_ATTRIBUTES, WEBGL_CONTEXT_ID } from '../constants';

// utils
import { drawBackground } from '../utils/drawBackground';

export const useCanvasRenderLoop = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext(WEBGL_CONTEXT_ID, WEBGL_CONTEXT_ATTRIBUTES);

    if (canvas && gl) {
      let frameId: number;

      const tick = (): void => {
        drawBackground(gl);
        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);

      return (): void => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [canvasRef]);
};
