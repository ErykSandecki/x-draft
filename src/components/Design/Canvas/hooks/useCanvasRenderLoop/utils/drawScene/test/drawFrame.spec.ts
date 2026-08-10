// types
import { NodeType } from 'types/design/enums';

// utils
import { drawFrame } from '../drawFrame';

const createGlMock = (): WebGL2RenderingContext =>
  ({
    LINE_LOOP: 2,
    STATIC_DRAW: 35044,
    TRIANGLES: 4,
    TRIANGLE_FAN: 6,
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    drawArrays: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn(() => ({})),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    uniform4fv: vi.fn(),
    useProgram: vi.fn(),
    vertexAttribPointer: vi.fn(),
  }) as unknown as WebGL2RenderingContext;

const IDENTITY_VIEWPORT = { x: 0, y: 0, zoom: 1 };

describe('drawFrame', () => {
  it('should draw nothing when no draft shape is given', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(gl, program, buffer, null, 100, 100, IDENTITY_VIEWPORT);

    // result
    expect(gl.drawArrays).not.toHaveBeenCalled();
  });

  it('should draw the draft outline and its 4 corner handles when given', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(
      gl,
      program,
      buffer,
      { fill: '#D9D9D9', height: 20, type: NodeType.rectangle, width: 10, x: 0, y: 0 },
      100,
      100,
      IDENTITY_VIEWPORT,
    );

    // result
    const lineLoopDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.LINE_LOOP);

    expect(lineLoopDraws).toHaveLength(5);
  });

  it('should show the shape filling in live for a rectangle draft, not just its outline', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(
      gl,
      program,
      buffer,
      { fill: '#D9D9D9', height: 20, type: NodeType.rectangle, width: 10, x: 0, y: 0 },
      100,
      100,
      IDENTITY_VIEWPORT,
    );

    // result — 4 corner handles + 1 for the rectangle's own fill
    const trianglesDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.TRIANGLES);

    expect(trianglesDraws).toHaveLength(5);
  });

  it('should show an elliptical fill live for an ellipse draft, without also filling its bounding box', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(
      gl,
      program,
      buffer,
      { fill: '#D9D9D9', height: 20, type: NodeType.ellipse, width: 10, x: 0, y: 0 },
      100,
      100,
      IDENTITY_VIEWPORT,
    );

    // result
    expect(gl.drawArrays).toHaveBeenCalledWith(gl.TRIANGLE_FAN, 0, expect.any(Number));

    const trianglesDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.TRIANGLES);

    expect(trianglesDraws).toHaveLength(4);
  });

  it('should still draw a rectangular bounding-box outline for an ellipse draft, connecting its corner handles', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(
      gl,
      program,
      buffer,
      { fill: '#D9D9D9', height: 20, type: NodeType.ellipse, width: 10, x: 0, y: 0 },
      100,
      100,
      IDENTITY_VIEWPORT,
    );

    // result — same as rectangle/frame: 1 box outline + 4 corner handles = 5 LINE_LOOP draws,
    const lineLoopDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.LINE_LOOP);

    expect(lineLoopDraws).toHaveLength(5);
    expect(lineLoopDraws.every(([, , count]) => count === 4)).toBe(true);
  });

  it('should show a polygonal fill live for a polygon draft, without also filling its bounding box', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(
      gl,
      program,
      buffer,
      { fill: '#D9D9D9', height: 20, sides: 5, type: NodeType.polygon, width: 10, x: 0, y: 0 },
      100,
      100,
      IDENTITY_VIEWPORT,
    );

    // result
    expect(gl.drawArrays).toHaveBeenCalledWith(gl.TRIANGLE_FAN, 0, expect.any(Number));

    const trianglesDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.TRIANGLES);

    expect(trianglesDraws).toHaveLength(4);
  });

  it('should still draw a rectangular bounding-box outline for a polygon draft, connecting its corner handles', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(
      gl,
      program,
      buffer,
      { fill: '#D9D9D9', height: 20, sides: 5, type: NodeType.polygon, width: 10, x: 0, y: 0 },
      100,
      100,
      IDENTITY_VIEWPORT,
    );

    // result — same as rectangle/frame: 1 box outline + 4 corner handles = 5 LINE_LOOP draws
    const lineLoopDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.LINE_LOOP);

    expect(lineLoopDraws).toHaveLength(5);
    expect(lineLoopDraws.every(([, , count]) => count === 4)).toBe(true);
  });

  it('should keep a frame draft fill-less, showing only its outline', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(
      gl,
      program,
      buffer,
      { fill: '#FFFFFF', height: 20, type: NodeType.frame, width: 10, x: 0, y: 0 },
      100,
      100,
      IDENTITY_VIEWPORT,
    );

    // result — only the 4 corner handles, no fill for the frame shape itself
    const trianglesDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.TRIANGLES);

    expect(trianglesDraws).toHaveLength(4);
  });

  it('should draw a live segment and 2 endpoint handles for a line draft, not a box outline', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;

    // before
    drawFrame(gl, program, buffer, { stroke: '#000000', type: NodeType.line, x1: 0, x2: 10, y1: 0, y2: 10 }, 100, 100, IDENTITY_VIEWPORT);

    // result — 1 segment fill + 2 endpoint-handle fills = 3 TRIANGLES draws, 2 endpoint-handle
    // strokes = 2 LINE_LOOP draws
    const trianglesDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.TRIANGLES);
    const lineLoopDraws = (gl.drawArrays as ReturnType<typeof vi.fn>).mock.calls.filter(([mode]) => mode === gl.LINE_LOOP);

    expect(trianglesDraws).toHaveLength(3);
    expect(lineLoopDraws).toHaveLength(2);
  });
});
