// others
import { DRAFT_FRAME_STROKE } from '../../../constants';

// store
import { selectOrderedNodes, selectSelectedNodes, selectViewport } from 'store/design/selectors';
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

  const viewport = selectViewport(store.getState());

  selectOrderedNodes(store.getState()).forEach((node) => {
    drawRect(gl, program, buffer, node, canvas.clientWidth, canvas.clientHeight, viewport);
  });

  selectSelectedNodes(store.getState()).forEach((node) => {
    const { height, width, x, y } = node;

    drawRect(
      gl,
      program,
      buffer,
      { height, stroke: DRAFT_FRAME_STROKE, width, x, y },
      canvas.clientWidth,
      canvas.clientHeight,
      viewport,
    );
    drawCornerHandles(gl, program, buffer, node, DRAFT_FRAME_STROKE, canvas.clientWidth, canvas.clientHeight, viewport);
  });

  if (draftRect) {
    drawRect(
      gl,
      program,
      buffer,
      { ...draftRect, stroke: DRAFT_FRAME_STROKE },
      canvas.clientWidth,
      canvas.clientHeight,
      viewport,
    );
    drawCornerHandles(
      gl,
      program,
      buffer,
      draftRect,
      DRAFT_FRAME_STROKE,
      canvas.clientWidth,
      canvas.clientHeight,
      viewport,
    );
  }
};
