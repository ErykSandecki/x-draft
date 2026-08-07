// types
import { TDraftRect } from '../../../types';

// utils
import { hexToRgbaFloat } from './hexToRgbaFloat';

export type TDrawableRect = TDraftRect & {
  fill?: string;
  fillAlpha?: number;
  stroke?: string;
};

const toClipSpace = (x: number, y: number, canvasWidth: number, canvasHeight: number): [number, number] => [
  (x / canvasWidth) * 2 - 1,
  1 - (y / canvasHeight) * 2,
];

export const drawRect = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  rect: TDrawableRect,
  canvasWidth: number,
  canvasHeight: number,
): void => {
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const colorLocation = gl.getUniformLocation(program, 'u_color');

  const [x1, y1] = toClipSpace(rect.x, rect.y, canvasWidth, canvasHeight);
  const [x2, y2] = toClipSpace(rect.x + rect.width, rect.y, canvasWidth, canvasHeight);
  const [x3, y3] = toClipSpace(rect.x + rect.width, rect.y + rect.height, canvasWidth, canvasHeight);
  const [x4, y4] = toClipSpace(rect.x, rect.y + rect.height, canvasWidth, canvasHeight);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  if (rect.fill) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y2, x3, y3, x1, y1, x3, y3, x4, y4]), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, hexToRgbaFloat(rect.fill, rect.fillAlpha));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  if (rect.stroke) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y2, x3, y3, x4, y4]), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, hexToRgbaFloat(rect.stroke));
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
  }
};
