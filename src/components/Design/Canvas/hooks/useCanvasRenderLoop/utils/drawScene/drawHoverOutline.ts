// others
import { DRAFT_FRAME_STROKE, HOVER_OUTLINE_WIDTH } from 'constant/canvas';

// types
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { drawThickOutline } from 'utils/canvas/drawThickOutline';

export const drawHoverOutline = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  hoveredNode: TSceneNode | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  if (hoveredNode) {
    drawThickOutline(
      gl,
      program,
      buffer,
      hoveredNode,
      DRAFT_FRAME_STROKE,
      HOVER_OUTLINE_WIDTH,
      canvasWidth,
      canvasHeight,
      viewport,
    );
  }
};
