export type TImageRenderContext = {
  buffer: WebGLBuffer;
  cache: Map<string, WebGLTexture>;
  program: WebGLProgram;
};
