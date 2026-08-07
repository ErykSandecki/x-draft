// store
import { addNode, setSelection } from 'store/design/designSlice';
import { store } from 'store';

// types
import { NodeType } from 'types/design/enums';

// utils
import { drawFrame } from '../drawFrame';

const createGlMock = (): WebGL2RenderingContext =>
  ({
    COLOR_BUFFER_BIT: 16384,
    LINE_LOOP: 2,
    STATIC_DRAW: 35044,
    TRIANGLES: 4,
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    clear: vi.fn(),
    clearColor: vi.fn(),
    colorMask: vi.fn(),
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

describe('drawFrame', () => {
  it('should re-enable alpha writes for the background clear, then lock them for foreground drawing', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;
    const canvas = document.createElement('canvas');

    // before
    drawFrame(gl, program, buffer, canvas);

    // result
    expect(gl.colorMask.mock.calls).toEqual([
      [true, true, true, true],
      [true, true, true, false],
    ]);
    expect(gl.clear).toHaveBeenCalledTimes(1);
  });

  it('should not draw a draft rect when none is given', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;
    const canvas = document.createElement('canvas');

    // before
    drawFrame(gl, program, buffer, canvas);

    // result
    expect(gl.drawArrays).not.toHaveBeenCalled();
  });

  it('should draw the draft rect and its 4 corner handles when given', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;
    const canvas = document.createElement('canvas');

    // before
    drawFrame(gl, program, buffer, canvas, { height: 20, width: 10, x: 0, y: 0 });

    // result
    expect(gl.drawArrays).toHaveBeenCalledWith(gl.LINE_LOOP, 0, 4);
    expect(gl.drawArrays).toHaveBeenCalledTimes(9);
  });

  it('should draw every node currently in the scene', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;
    const canvas = document.createElement('canvas');

    store.dispatch(
      addNode({
        fill: '#ff0000',
        height: 20,
        name: 'Frame 1',
        parentId: null,
        rotation: 0,
        type: NodeType.frame,
        width: 10,
        x: 0,
        y: 0,
      }),
    );

    // before
    drawFrame(gl, program, buffer, canvas);

    // result
    expect(gl.drawArrays).toHaveBeenCalledWith(gl.TRIANGLES, 0, 6);
  });

  it('should draw a selection outline and corner handles for each selected node', () => {
    // mock
    const gl = createGlMock();
    const program = {} as WebGLProgram;
    const buffer = {} as WebGLBuffer;
    const canvas = document.createElement('canvas');

    store.dispatch(
      addNode({
        fill: '#00ff00',
        height: 20,
        name: 'Frame 2',
        parentId: null,
        rotation: 0,
        type: NodeType.frame,
        width: 10,
        x: 0,
        y: 0,
      }),
    );

    const { rootOrder } = store.getState().design;
    const selectedId = rootOrder[rootOrder.length - 1];

    // action
    store.dispatch(setSelection([selectedId]));

    // before
    drawFrame(gl, program, buffer, canvas);

    // result
    expect(gl.drawArrays).toHaveBeenCalledWith(gl.LINE_LOOP, 0, 4);
  });
});
