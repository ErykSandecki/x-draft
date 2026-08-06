export const BACKGROUND_COLOR = '#444444';
export const BACKGROUND_ALPHA = 1;
export const RESIZE_DEBOUNCE_MS = 500;
export const WEBGL_CONTEXT_ID = 'webgl2';
export const WEBGL_CONTEXT_ATTRIBUTES: WebGLContextAttributes = { premultipliedAlpha: false };

export const MIN_FRAME_SIZE = 2;
export const DRAFT_FRAME_STROKE = '#0d99ff';

export const CORNER_HANDLE_SIZE = 6;
export const CORNER_HANDLE_FILL = '#ffffff';

export const VERTEX_SHADER_SOURCE = `#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision mediump float;

uniform vec4 u_color;
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;
