// utils
import { resizeCanvas } from '../resizeCanvas';

describe('resizeCanvas', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should size the canvas using devicePixelRatio', () => {
    // mock
    vi.stubGlobal('devicePixelRatio', 2);

    const canvas = document.createElement('canvas');

    // spy
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ height: 50, width: 100 } as DOMRect);

    // before
    resizeCanvas(canvas);

    // result
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
  });

  it('should update the WebGL viewport to match the new size', () => {
    // mock
    vi.stubGlobal('devicePixelRatio', 1);

    const canvas = document.createElement('canvas');
    const viewport = vi.fn();

    // spy
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ height: 50, width: 100 } as DOMRect);
    vi.spyOn(canvas, 'getContext').mockReturnValue({ viewport } as unknown as WebGL2RenderingContext);

    // before
    resizeCanvas(canvas);

    // result
    expect(viewport).toHaveBeenCalledWith(0, 0, 100, 50);
  });
});
