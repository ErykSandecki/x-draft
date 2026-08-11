// types
import { TTextNode } from 'types/design/types';

// utils
import { wrapText } from './wrapText';

const LINE_HEIGHT_MULTIPLIER = 1.2;

const measureWrappedLines = (content: string, width: number, fontSize: number, fontFamily: string): string[] => {
  const context = document.createElement('canvas').getContext('2d');

  if (!context) {
    return [content];
  }

  context.font = `${fontSize}px ${fontFamily}`;

  return wrapText(context, content, width);
};

const renderTextCanvas = (
  lines: string[],
  width: number,
  height: number,
  fontSize: number,
  fontFamily: string,
  fill: string,
): HTMLCanvasElement => {
  const dpr = window.devicePixelRatio || 1;
  const lineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
  const canvas = document.createElement('canvas');

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const context = canvas.getContext('2d');

  if (context) {
    context.scale(dpr, dpr);
    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = fill;
    context.textBaseline = 'top';

    lines.forEach((line, index) => {
      context.fillText(line, 0, index * lineHeight);
    });
  }

  return canvas;
};

export const getOrCreateTextTexture = (
  gl: WebGL2RenderingContext,
  cache: Map<string, WebGLTexture>,
  node: TTextNode,
): WebGLTexture | null => {
  const { content, fill, fontFamily, fontSize, height, id, width } = node;
  const key = `${id}:${content}:${width}:${height}:${fontSize}:${fontFamily}:${fill}`;
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const lines = measureWrappedLines(content, width, fontSize, fontFamily);
  const canvas = renderTextCanvas(lines, width, height, fontSize, fontFamily, fill);
  const texture = gl.createTexture();

  if (texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    cache.set(key, texture);
  }

  return texture;
};
