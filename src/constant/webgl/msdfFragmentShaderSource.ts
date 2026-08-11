export default `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_color;
uniform float u_screenPxRange;
in vec2 v_texCoord;
out vec4 outColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 msdf = texture(u_texture, v_texCoord).rgb;
  float signedDist = median(msdf.r, msdf.g, msdf.b) - 0.5;
  float screenPxDistance = u_screenPxRange * signedDist;
  float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);
  float contrast = mix(1.8, 1.0, clamp(u_screenPxRange / 2.0, 0.0, 1.0));
  opacity = clamp((opacity - 0.5) * contrast + 0.5, 0.0, 1.0);

  outColor = vec4(u_color.rgb, u_color.a * opacity);
}
`;
