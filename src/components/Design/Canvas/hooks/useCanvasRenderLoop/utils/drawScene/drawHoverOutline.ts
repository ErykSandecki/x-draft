// others
import { DRAFT_FRAME_STROKE, HOVER_OUTLINE_WIDTH } from 'constant/canvas';

// types
import { NodeType } from 'types/design/enums';
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { drawThickEllipseOutline } from 'utils/canvas/drawThickEllipseOutline';
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
    if (hoveredNode.type === NodeType.ellipse) {
      drawThickEllipseOutline(
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
    } else {
      drawThickOutline(gl, program, buffer, hoveredNode, DRAFT_FRAME_STROKE, HOVER_OUTLINE_WIDTH, canvasWidth, canvasHeight, viewport);
    }
  }
};
