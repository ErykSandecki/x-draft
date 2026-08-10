// others
import { DRAFT_FRAME_STROKE } from 'constant/canvas';

// types
import { NodeType } from 'types/design/enums';
import { TDraftPolygon, TDraftShape, TViewport } from 'types/design/types';

// utils
import { drawCornerHandles } from 'utils/canvas/drawCornerHandles';
import { drawEllipse } from 'utils/canvas/drawEllipse';
import { drawPolygon } from 'utils/canvas/drawPolygon';
import { drawRect } from 'utils/canvas/drawRect';

export const drawDraftShape = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  draftShape: TDraftShape | TDraftPolygon,
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  const fill = draftShape.type === NodeType.frame ? undefined : draftShape.fill;

  switch (draftShape.type) {
    case NodeType.ellipse:
      drawEllipse(gl, program, buffer, { ...draftShape, fill }, canvasWidth, canvasHeight, viewport);
      drawRect(gl, program, buffer, { ...draftShape, fill: undefined, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
      break;
    case NodeType.polygon:
      drawPolygon(gl, program, buffer, { ...draftShape, fill }, canvasWidth, canvasHeight, viewport);
      drawRect(gl, program, buffer, { ...draftShape, fill: undefined, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
      break;
    default:
      drawRect(gl, program, buffer, { ...draftShape, fill, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
  }

  drawCornerHandles(gl, program, buffer, draftShape, DRAFT_FRAME_STROKE, canvasWidth, canvasHeight, viewport);
};
