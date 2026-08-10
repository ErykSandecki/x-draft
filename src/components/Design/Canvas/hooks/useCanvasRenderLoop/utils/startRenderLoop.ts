import { RefObject } from 'react';

// types
import { TDraftRect } from 'types/canvas';
import { TDraftEntity } from 'types/design/types';
import { TImageRenderContext, TMediaPreview } from '../types';

// utils
import { drawScene } from './drawScene/drawScene';

type TFrameIdRef = { current: number };

const tick = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  imageContext: TImageRenderContext,
  canvas: HTMLCanvasElement,
  frameIdRef: TFrameIdRef,
  draftRef?: RefObject<TDraftEntity | null>,
  marqueeRef?: RefObject<TDraftRect | null>,
  hoverRef?: RefObject<string | null>,
  mediaPreviewRef?: RefObject<TMediaPreview | null>,
): void => {
  drawScene(gl, program, buffer, imageContext, canvas, draftRef?.current, marqueeRef?.current, hoverRef?.current, mediaPreviewRef?.current);
  frameIdRef.current = requestAnimationFrame(() =>
    tick(gl, program, buffer, imageContext, canvas, frameIdRef, draftRef, marqueeRef, hoverRef, mediaPreviewRef),
  );
};

export const startRenderLoop = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  imageContext: TImageRenderContext,
  canvas: HTMLCanvasElement,
  draftRef?: RefObject<TDraftEntity | null>,
  marqueeRef?: RefObject<TDraftRect | null>,
  hoverRef?: RefObject<string | null>,
  mediaPreviewRef?: RefObject<TMediaPreview | null>,
): (() => void) => {
  const frameIdRef: TFrameIdRef = { current: 0 };

  frameIdRef.current = requestAnimationFrame(() =>
    tick(gl, program, buffer, imageContext, canvas, frameIdRef, draftRef, marqueeRef, hoverRef, mediaPreviewRef),
  );

  return (): void => cancelAnimationFrame(frameIdRef.current);
};
