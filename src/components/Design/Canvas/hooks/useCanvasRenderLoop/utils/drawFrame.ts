// others
import { DRAFT_FRAME_STROKE } from '../../../constants';

// store
import { selectOrderedNodes } from 'store/design/selectors';
import { store } from 'store';

// types
import { TDraftRect } from '../../../types';

// utils
import { drawBackground } from './drawBackground';
import { drawCornerHandles } from './drawCornerHandles';
import { drawRect } from './drawRect';

export const drawFrame = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  canvas: HTMLCanvasElement,
  draftRect?: TDraftRect | null,
): void => {
  gl.colorMask(true, true, true, true);
  drawBackground(gl);
  gl.colorMask(true, true, true, false);

  selectOrderedNodes(store.getState()).forEach((node) => {
    drawRect(gl, program, buffer, node, canvas.clientWidth, canvas.clientHeight);
  });

  if (draftRect) {
    drawRect(
      gl,
      program,
      buffer,
      { ...draftRect, stroke: DRAFT_FRAME_STROKE },
      canvas.clientWidth,
      canvas.clientHeight,
    );
    drawCornerHandles(gl, program, buffer, draftRect, DRAFT_FRAME_STROKE, canvas.clientWidth, canvas.clientHeight);
  }
};
