// store
import { selectOrderedNodes, selectSelectedNodes, selectViewport } from 'store/design/selectors';
import { store } from 'store';

// types
import { TDraftRect } from 'types/canvas';

// utils
import { drawDraftFrame } from './drawDraftFrame';
import { drawMarquee } from 'utils/canvas/drawMarquee';
import { drawSceneBackground } from 'utils/canvas/drawSceneBackground';
import { drawSceneNodes } from './drawSceneNodes';
import { drawSelectionOutline } from './drawSelectionOutline';

export const drawFrame = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  canvas: HTMLCanvasElement,
  draftRect?: TDraftRect | null,
  marqueeRect?: TDraftRect | null,
): void => {
  const state = store.getState();
  const viewport = selectViewport(state);
  const { clientHeight, clientWidth } = canvas;

  drawSceneBackground(gl);
  drawSceneNodes(gl, program, buffer, selectOrderedNodes(state), clientWidth, clientHeight, viewport);
  drawSelectionOutline(gl, program, buffer, selectSelectedNodes(state), clientWidth, clientHeight, viewport);
  drawDraftFrame(gl, program, buffer, draftRect, clientWidth, clientHeight, viewport);
  drawMarquee(gl, program, buffer, marqueeRect, clientWidth, clientHeight, viewport);
};
