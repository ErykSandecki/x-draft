// others
import { DRAFT_FRAME_STROKE } from 'constant/canvas';

// types
import { TDraftRect } from 'types/canvas';
import { TViewport } from 'types/design/types';

// utils
import { drawCornerHandles } from 'utils/canvas/drawCornerHandles';
import { drawRect } from 'utils/canvas/drawRect';

export const drawDraftFrame = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  draftRect: TDraftRect | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  if (draftRect) {
    drawRect(gl, program, buffer, { ...draftRect, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
    drawCornerHandles(gl, program, buffer, draftRect, DRAFT_FRAME_STROKE, canvasWidth, canvasHeight, viewport);
  }
};
