import { RefObject } from 'react';

// types
import { TDraftRect } from 'types/canvas';
import { TDraftEntity } from 'types/design/types';

// utils
import { drawScene } from './drawScene/drawScene';

type TFrameIdRef = { current: number };

const tick = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  canvas: HTMLCanvasElement,
  frameIdRef: TFrameIdRef,
  draftRef?: RefObject<TDraftEntity | null>,
  marqueeRef?: RefObject<TDraftRect | null>,
  hoverRef?: RefObject<string | null>,
): void => {
  drawScene(gl, program, buffer, canvas, draftRef?.current, marqueeRef?.current, hoverRef?.current);
  frameIdRef.current = requestAnimationFrame(() => tick(gl, program, buffer, canvas, frameIdRef, draftRef, marqueeRef, hoverRef));
};

export const startRenderLoop = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  canvas: HTMLCanvasElement,
  draftRef?: RefObject<TDraftEntity | null>,
  marqueeRef?: RefObject<TDraftRect | null>,
  hoverRef?: RefObject<string | null>,
): (() => void) => {
  const frameIdRef: TFrameIdRef = { current: 0 };

  frameIdRef.current = requestAnimationFrame(() => tick(gl, program, buffer, canvas, frameIdRef, draftRef, marqueeRef, hoverRef));

  return (): void => cancelAnimationFrame(frameIdRef.current);
};
