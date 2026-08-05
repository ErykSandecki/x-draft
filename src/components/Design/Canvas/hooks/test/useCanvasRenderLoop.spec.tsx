import { renderHook } from '@testing-library/react';
import { RefObject } from 'react';

// hooks
import { useCanvasRenderLoop } from '../useCanvasRenderLoop';

let rafCallback: FrameRequestCallback | undefined;

const requestAnimationFrameMock = vi.fn((callback: FrameRequestCallback) => {
  rafCallback = callback;

  return 1;
});
const cancelAnimationFrameMock = vi.fn();

type TGlCanvasRef = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  clear: ReturnType<typeof vi.fn>;
  clearColor: ReturnType<typeof vi.fn>;
};

const createGlCanvasRef = (): TGlCanvasRef => {
  const canvas = document.createElement('canvas');
  const clearColor = vi.fn();
  const clear = vi.fn();

  vi.spyOn(canvas, 'getContext').mockReturnValue({
    COLOR_BUFFER_BIT: 16384,
    clear,
    clearColor,
  } as unknown as WebGL2RenderingContext);

  return { canvasRef: { current: canvas }, clear, clearColor };
};

describe('useCanvasRenderLoop behaviors', () => {
  beforeEach(() => {
    rafCallback = undefined;
    vi.stubGlobal('requestAnimationFrame', requestAnimationFrameMock);
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    requestAnimationFrameMock.mockClear();
    cancelAnimationFrameMock.mockClear();
  });

  it('should do nothing when the canvas has no WebGL context', () => {
    // before
    const canvasRef: RefObject<HTMLCanvasElement | null> = { current: document.createElement('canvas') };

    // result
    expect(() => renderHook(() => useCanvasRenderLoop(canvasRef))).not.toThrow();
    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
  });

  it('should draw the background on every frame', () => {
    // mock
    const { canvasRef, clear, clearColor } = createGlCanvasRef();

    // before
    renderHook(() => useCanvasRenderLoop(canvasRef));

    // action
    rafCallback?.(0);

    // result
    expect(clearColor).toHaveBeenCalledTimes(1);
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it('should schedule the next frame after drawing', () => {
    // mock
    const { canvasRef } = createGlCanvasRef();

    // before
    renderHook(() => useCanvasRenderLoop(canvasRef));

    // action
    rafCallback?.(0);

    // result
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(2);
  });

  it('should cancel the scheduled frame on unmount', () => {
    // mock
    const { canvasRef } = createGlCanvasRef();

    // before
    const { unmount } = renderHook(() => useCanvasRenderLoop(canvasRef));

    // action
    unmount();

    // result
    expect(cancelAnimationFrameMock).toHaveBeenCalledTimes(1);
  });
});
