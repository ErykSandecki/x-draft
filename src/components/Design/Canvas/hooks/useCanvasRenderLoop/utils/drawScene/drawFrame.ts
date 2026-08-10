// others
import { DRAFT_FRAME_STROKE, LINE_RENDER_STROKE_WIDTH } from 'constant/canvas';

// types
import { NodeType } from 'types/design/enums';
import { TDraftEntity, TViewport } from 'types/design/types';

// utils
import { drawCornerHandles } from 'utils/canvas/drawCornerHandles';
import { drawEllipse } from 'utils/canvas/drawEllipse';
import { drawLine } from 'utils/canvas/drawLine';
import { drawLineEndpointHandles } from 'utils/canvas/drawLineEndpointHandles';
import { drawPolygon } from 'utils/canvas/drawPolygon';
import { drawRect } from 'utils/canvas/drawRect';

export const drawFrame = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  draftShape: TDraftEntity | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  if (draftShape && draftShape.type === NodeType.line) {
    drawLine(gl, program, buffer, draftShape, draftShape.stroke, LINE_RENDER_STROKE_WIDTH, canvasWidth, canvasHeight, viewport);
    drawLineEndpointHandles(
      gl,
      program,
      buffer,
      [
        { x: draftShape.x1, y: draftShape.y1 },
        { x: draftShape.x2, y: draftShape.y2 },
      ],
      DRAFT_FRAME_STROKE,
      canvasWidth,
      canvasHeight,
      viewport,
    );
  } else if (draftShape) {
    const fill = draftShape.type === NodeType.frame ? undefined : draftShape.fill;

    if (draftShape.type === NodeType.ellipse) {
      drawEllipse(gl, program, buffer, { ...draftShape, fill }, canvasWidth, canvasHeight, viewport);
      drawRect(gl, program, buffer, { ...draftShape, fill: undefined, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
    } else if (draftShape.type === NodeType.polygon) {
      drawPolygon(gl, program, buffer, { ...draftShape, fill }, canvasWidth, canvasHeight, viewport);
      drawRect(gl, program, buffer, { ...draftShape, fill: undefined, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
    } else {
      drawRect(gl, program, buffer, { ...draftShape, fill, stroke: DRAFT_FRAME_STROKE }, canvasWidth, canvasHeight, viewport);
    }

    drawCornerHandles(gl, program, buffer, draftShape, DRAFT_FRAME_STROKE, canvasWidth, canvasHeight, viewport);
  }
};
