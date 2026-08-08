// others
import { DRAFT_FRAME_STROKE } from 'constant/canvas';

// types
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { drawCornerHandles } from 'utils/canvas/drawCornerHandles';
import { drawRect } from 'utils/canvas/drawRect';

export const drawPerNodeSelectionOutlines = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  selectedNodes: TSceneNode[],
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  selectedNodes.forEach((node) => {
    const { height, width, x, y } = node;

    drawRect(gl, program, buffer, { height, stroke: DRAFT_FRAME_STROKE, width, x, y }, canvasWidth, canvasHeight, viewport);
    drawCornerHandles(gl, program, buffer, node, DRAFT_FRAME_STROKE, canvasWidth, canvasHeight, viewport);
  });
};
