// others
import { MSDF_ATLAS_PNG_URL } from 'constant/webgl/msdfAtlas';

// utils
import { getOrLoadTexture } from './getOrLoadTexture';

export const getMsdfAtlasTexture = (gl: WebGL2RenderingContext, cache: Map<string, WebGLTexture>): WebGLTexture | null =>
  getOrLoadTexture(gl, cache, MSDF_ATLAS_PNG_URL);
