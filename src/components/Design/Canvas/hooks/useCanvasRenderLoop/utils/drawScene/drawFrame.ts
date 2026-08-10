// types
import { NodeType } from 'types/design/enums';
import { TDraftEntity, TViewport } from 'types/design/types';

// utils
import { drawDraftLine } from './drawDraftLine';
import { drawDraftShape } from './drawDraftShape';

export const drawFrame = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  draftShape: TDraftEntity | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  if (draftShape) {
    if (draftShape.type === NodeType.line) {
      drawDraftLine(gl, program, buffer, draftShape, canvasWidth, canvasHeight, viewport);
    } else {
      drawDraftShape(gl, program, buffer, draftShape, canvasWidth, canvasHeight, viewport);
    }
  }
};
