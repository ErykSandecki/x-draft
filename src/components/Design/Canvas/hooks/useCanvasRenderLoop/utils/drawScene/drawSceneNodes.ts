// others
import { LINE_RENDER_STROKE_WIDTH } from 'constant/canvas';

// types
import { NodeType } from 'types/design/enums';
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { drawEllipse } from 'utils/canvas/drawEllipse';
import { drawLine } from 'utils/canvas/drawLine';
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
    } else if (node.type === NodeType.line) {
      drawLine(gl, program, buffer, node, node.stroke, LINE_RENDER_STROKE_WIDTH, canvasWidth, canvasHeight, viewport);
    } else {
      drawRect(gl, program, buffer, node, canvasWidth, canvasHeight, viewport);
    }
  });
};
