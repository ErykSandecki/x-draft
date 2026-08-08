// others
import { DRAFT_FRAME_STROKE } from 'constant/canvas';

// types
import { NodeType } from 'types/design/enums';
import { TDraftShape, TViewport } from 'types/design/types';

// utils
import { drawCornerHandles } from 'utils/canvas/drawCornerHandles';
import { drawEllipse } from 'utils/canvas/drawEllipse';
import { drawRect } from 'utils/canvas/drawRect';

export const drawFrame = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  draftShape: TDraftShape | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  if (draftShape) {
    const fill = draftShape.type === NodeType.frame ? undefined : draftShape.fill;

    if (draftShape.type === NodeType.ellipse) {
      drawEllipse(gl, program, buffer, { ...draftShape, fill }, canvasWidth, canvasHeight, viewport);
      drawRect(gl, program, buffer, { ...draftShape, fill: undefined, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
    } else {
      drawRect(gl, program, buffer, { ...draftShape, fill, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
    }

    drawCornerHandles(gl, program, buffer, draftShape, DRAFT_FRAME_STROKE, canvasWidth, canvasHeight, viewport);
  }
};
