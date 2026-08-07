export const RESIZE_DEBOUNCE_MS = 500;
export const MIN_FRAME_SIZE = 2;
export const DRAFT_FRAME_STROKE = '#0d99ff';
export const WEBGL_CONTEXT_ID = 'webgl2';
export const WEBGL_CONTEXT_ATTRIBUTES: WebGLContextAttributes = { premultipliedAlpha: false };
export const ZOOM_MIN = 0.1;
export const ZOOM_MAX = 8;
export const ZOOM_DELTA_THRESHOLD = 20;
export const ZOOM_STEP_TRACKPAD = 0.032;
export const ZOOM_STEP_WHEEL = 0.0768;

export const VERTEX_SHADER_SOURCE = `#version 300 es
in vec2 a_position;

uniform vec2 u_viewportOffset;
uniform float u_zoom;
uniform vec2 u_resolution;

void main() {
  vec2 screenPos = a_position * u_zoom + u_viewportOffset;
  vec2 clip = vec2(
    (screenPos.x / u_resolution.x) * 2.0 - 1.0,
    1.0 - (screenPos.y / u_resolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
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
