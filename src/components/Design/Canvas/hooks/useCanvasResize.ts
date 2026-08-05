import { RefObject, useEffect } from 'react';

export const useCanvasResize = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  const resizeCanvas = (canvas: HTMLCanvasElement): void => {
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.getContext('2d')?.scale(dpr, dpr);
  };

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
