import { RefObject, useEffect } from 'react';

// others
import { BACKGROUND_ALPHA, BACKGROUND_COLOR } from '../constants';

const drawBackground = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = BACKGROUND_ALPHA;
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
};

export const useCanvasRenderLoop = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      let frameId: number;

      const tick = (): void => {
        drawBackground(context, canvas);
        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);

      return (): void => cancelAnimationFrame(frameId);
    }
  }, [canvasRef]);
};
