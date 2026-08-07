import { RefObject, useEffect } from 'react';

// others
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE, WEBGL_CONTEXT_ATTRIBUTES, WEBGL_CONTEXT_ID } from '../constants';

// types
import { TDraftRect } from '../types';

// utils
import { createProgram } from '../utils/createProgram';
import { startRenderLoop } from '../utils/startRenderLoop';

export const useCanvasRenderLoop = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draftRef?: RefObject<TDraftRect | null>,
): void => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext(WEBGL_CONTEXT_ID, WEBGL_CONTEXT_ATTRIBUTES);
    const program = gl && createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    const buffer = gl && gl.createBuffer();

    if (canvas && gl && program && buffer) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const stopRenderLoop = startRenderLoop(gl, program, buffer, canvas, draftRef);

      return (): void => {
        stopRenderLoop();
        gl.deleteBuffer(buffer);
      };
    }
  }, [canvasRef, draftRef]);
};
