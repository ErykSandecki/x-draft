// types
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { drawRect } from 'utils/canvas/drawRect';

export const drawSceneNodes = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  nodes: TSceneNode[],
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  nodes.forEach((node) => {
    drawRect(gl, program, buffer, node, canvasWidth, canvasHeight, viewport);
  });
};
