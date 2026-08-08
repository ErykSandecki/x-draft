// store
import { selectNodes, selectOrderedNodes, selectSelectedNodes, selectViewport } from 'store/design/selectors';
import { store } from 'store';

// types
import { TDraftRect } from 'types/canvas';
import { TDraftShape } from 'types/design/types';

// utils
import { drawFrame } from './drawFrame';
import { drawHoverOutline } from './drawHoverOutline';
import { drawMarquee } from 'utils/canvas/drawMarquee';
import { drawSceneBackground } from 'utils/canvas/drawSceneBackground';
import { drawSceneNodes } from './drawSceneNodes';
import { drawSelectionOutline } from './drawSelectionOutline';

export const drawScene = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  canvas: HTMLCanvasElement,
  draftShape?: TDraftShape | null,
  marqueeRect?: TDraftRect | null,
  hoveredNodeId?: string | null,
): void => {
  const state = store.getState();
  const viewport = selectViewport(state);
  const { clientHeight, clientWidth } = canvas;

  drawSceneBackground(gl);
  drawSceneNodes(gl, program, buffer, selectOrderedNodes(state), clientWidth, clientHeight, viewport);
  drawHoverOutline(gl, program, buffer, hoveredNodeId ? selectNodes(state)[hoveredNodeId] : null, clientWidth, clientHeight, viewport);
  drawSelectionOutline(gl, program, buffer, selectSelectedNodes(state), clientWidth, clientHeight, viewport);
  drawFrame(gl, program, buffer, draftShape, clientWidth, clientHeight, viewport);
  drawMarquee(gl, program, buffer, marqueeRect, clientWidth, clientHeight, viewport);
};
