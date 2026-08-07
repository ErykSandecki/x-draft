// others
import { CORNER_HANDLE_FILL, CORNER_HANDLE_SIZE } from '../../../constants';

// types
import { TDraftRect } from '../../../types';

// utils
import { drawRect } from './drawRect';
import { getRectCorners } from './getRectCorners';

export const drawCornerHandles = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  rect: TDraftRect,
  strokeColor: string,
  canvasWidth: number,
  canvasHeight: number,
): void => {
  getRectCorners(rect).forEach((corner) => {
    drawRect(
      gl,
      program,
      buffer,
      {
        fill: CORNER_HANDLE_FILL,
        height: CORNER_HANDLE_SIZE,
        stroke: strokeColor,
        width: CORNER_HANDLE_SIZE,
        x: corner.x - CORNER_HANDLE_SIZE / 2,
        y: corner.y - CORNER_HANDLE_SIZE / 2,
      },
      canvasWidth,
      canvasHeight,
    );
  });
};
