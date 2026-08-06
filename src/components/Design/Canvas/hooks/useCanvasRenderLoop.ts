import { RefObject, useEffect } from 'react';

// others
import {
  DRAFT_FRAME_STROKE,
  FRAGMENT_SHADER_SOURCE,
  VERTEX_SHADER_SOURCE,
  WEBGL_CONTEXT_ATTRIBUTES,
  WEBGL_CONTEXT_ID,
} from '../constants';

// store
import { selectOrderedNodes } from 'store/design/selectors';
import { store } from 'store';

// types
import { TDraftRect } from '../types';

// utils
import { createProgram } from '../utils/createProgram';
import { drawBackground } from '../utils/drawBackground';
import { drawCornerHandles } from '../utils/drawCornerHandles';
import { drawRect } from '../utils/drawRect';

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
      let frameId: number;

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const tick = (): void => {
        gl.colorMask(true, true, true, true);
        drawBackground(gl);

        // lock the alpha channel so foreground drawing only blends visually against what's
        // already on the canvas, instead of punching through to the DOM behind it
        gl.colorMask(true, true, true, false);

        selectOrderedNodes(store.getState()).forEach((node) => {
          drawRect(gl, program, buffer, node, canvas.clientWidth, canvas.clientHeight);
        });

        if (draftRef?.current) {
          drawRect(
            gl,
            program,
            buffer,
            { ...draftRef.current, stroke: DRAFT_FRAME_STROKE },
            canvas.clientWidth,
            canvas.clientHeight,
          );
          drawCornerHandles(
            gl,
            program,
            buffer,
            draftRef.current,
            DRAFT_FRAME_STROKE,
            canvas.clientWidth,
            canvas.clientHeight,
          );
        }

        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);

      return (): void => {
        cancelAnimationFrame(frameId);
        gl.deleteBuffer(buffer);
      };
    }
  }, [canvasRef, draftRef]);
};
