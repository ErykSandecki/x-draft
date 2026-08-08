// types
import { NodeType } from 'types/design/enums';
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { drawEllipse } from 'utils/canvas/drawEllipse';
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
    if (node.type === NodeType.ellipse) {
      drawEllipse(gl, program, buffer, node, canvasWidth, canvasHeight, viewport);
    } else {
      drawRect(gl, program, buffer, node, canvasWidth, canvasHeight, viewport);
    }
  });
};
