// types
import { TPoint } from 'types/canvas';

export type TImageRenderContext = {
  buffer: WebGLBuffer;
  cache: Map<string, WebGLTexture>;
  program: WebGLProgram;
};

export type TMediaPreview = {
  aspectRatio: number;
  point: TPoint;
  src: string;
};
