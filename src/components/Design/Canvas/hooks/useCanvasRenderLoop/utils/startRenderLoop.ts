import { RefObject } from 'react';

// types
import { TDraftRect } from 'types/canvas';

// utils
import { drawFrame } from './drawFrame/drawFrame';

type TFrameIdRef = { current: number };

const tick = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  canvas: HTMLCanvasElement,
  frameIdRef: TFrameIdRef,
  draftRef?: RefObject<TDraftRect | null>,
): void => {
  drawFrame(gl, program, buffer, canvas, draftRef?.current);
  frameIdRef.current = requestAnimationFrame(() => tick(gl, program, buffer, canvas, frameIdRef, draftRef));
};

export const startRenderLoop = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  canvas: HTMLCanvasElement,
  draftRef?: RefObject<TDraftRect | null>,
): (() => void) => {
  const frameIdRef: TFrameIdRef = { current: 0 };

  frameIdRef.current = requestAnimationFrame(() => tick(gl, program, buffer, canvas, frameIdRef, draftRef));

  return (): void => cancelAnimationFrame(frameIdRef.current);
};
