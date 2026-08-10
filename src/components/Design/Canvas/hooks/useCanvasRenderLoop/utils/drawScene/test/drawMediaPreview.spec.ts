// types
import { TImageRenderContext } from '../../../types';

// utils
import { drawMediaPreview } from '../drawMediaPreview';

const createGlMock = (): WebGL2RenderingContext =>
  ({
    RGBA: 6408,
    STATIC_DRAW: 35044,
    TEXTURE0: 33984,
    TEXTURE_2D: 3553,
    TRIANGLES: 4,
    activeTexture: vi.fn(),
    bindBuffer: vi.fn(),
    bindTexture: vi.fn(),
    bufferData: vi.fn(),
    createTexture: vi.fn(() => ({})),
    drawArrays: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn(() => ({})),
    texImage2D: vi.fn(),
    texParameteri: vi.fn(),
    uniform1f: vi.fn(),
    uniform1i: vi.fn(),
    uniform2f: vi.fn(),
    useProgram: vi.fn(),
    vertexAttribPointer: vi.fn(),
  }) as unknown as WebGL2RenderingContext;

const IDENTITY_VIEWPORT = { x: 0, y: 0, zoom: 1 };
const IMAGE_CONTEXT: TImageRenderContext = { buffer: {} as WebGLBuffer, cache: new Map(), program: {} as WebGLProgram };

describe('drawMediaPreview', () => {
  it('should draw nothing when no preview is given', () => {
    // mock
    const gl = createGlMock();

    // before
    drawMediaPreview(gl, IMAGE_CONTEXT, null, 100, 100, IDENTITY_VIEWPORT);

    // result
    expect(gl.drawArrays).not.toHaveBeenCalled();
  });

  it('should draw a textured quad near the given point when a preview is given', () => {
    // mock
    const gl = createGlMock();

    // before
    drawMediaPreview(gl, IMAGE_CONTEXT, { aspectRatio: 1, point: { x: 50, y: 50 }, src: 'image.png' }, 100, 100, IDENTITY_VIEWPORT);

    // result
    expect(gl.drawArrays).toHaveBeenCalledWith(gl.TRIANGLES, 0, 6);
  });

  it('should keep the wide-image preview a constant screen size regardless of zoom', () => {
    // mock
    const gl = createGlMock();

    // before
    drawMediaPreview(gl, IMAGE_CONTEXT, { aspectRatio: 2, point: { x: 0, y: 0 }, src: 'image.png' }, 100, 100, { x: 0, y: 0, zoom: 2 });

    // result — world-space width should be half the screen-space cap since zoom is 2
    const [firstCall] = (gl.bufferData as ReturnType<typeof vi.fn>).mock.calls;
    const vertices: Float32Array = firstCall[1];
    const worldWidth = vertices[4] - vertices[0];

    expect(worldWidth).toBeCloseTo(60);
  });

  it('should shrink the short edge of a tall image preview by its aspect ratio', () => {
    // mock
    const gl = createGlMock();

    // before
    drawMediaPreview(gl, IMAGE_CONTEXT, { aspectRatio: 0.5, point: { x: 0, y: 0 }, src: 'image.png' }, 100, 100, IDENTITY_VIEWPORT);

    // result
    const [firstCall] = (gl.bufferData as ReturnType<typeof vi.fn>).mock.calls;
    const vertices: Float32Array = firstCall[1];
    const worldWidth = vertices[4] - vertices[0];
    const worldHeight = vertices[9] - vertices[1];

    expect(worldWidth).toBeCloseTo(60);
    expect(worldHeight).toBeCloseTo(120);
  });
});
