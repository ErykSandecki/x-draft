// types
import { NodeType } from 'types/design/enums';
import { TTextNode } from 'types/design/types';

// utils
import { getOrCreateTextTexture } from '../getOrCreateTextTexture';

const createGlMock = (createTextureReturn: object | null = {}): WebGL2RenderingContext =>
  ({
    RGBA: 6408,
    TEXTURE_2D: 3553,
    UNSIGNED_BYTE: 5121,
    bindTexture: vi.fn(),
    createTexture: vi.fn(() => createTextureReturn),
    texImage2D: vi.fn(),
    texParameteri: vi.fn(),
  }) as unknown as WebGL2RenderingContext;

const createNode = (overrides: Partial<TTextNode> = {}): TTextNode => ({
  content: 'hello',
  fill: '#ffffff',
  fontFamily: 'Inter',
  fontSize: 14,
  height: 20,
  id: 'text-1',
  name: 'Text',
  parentId: null,
  rotation: 0,
  type: NodeType.text,
  width: 100,
  x: 0,
  y: 0,
  ...overrides,
});

describe('getOrCreateTextTexture', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should render and cache a new texture for a node not seen before', () => {
    // mock
    const fillText = vi.fn();
    const context = {
      fillStyle: '',
      fillText,
      font: '',
      measureText: (text: string): { width: number } => ({ width: text.length * 5 }),
      scale: vi.fn(),
      textBaseline: '',
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);

    const gl = createGlMock();
    const cache = new Map<string, WebGLTexture>();

    // before
    const texture = getOrCreateTextTexture(gl, cache, createNode());

    // result
    expect(texture).not.toBeNull();
    expect(cache.size).toBe(1);
    expect(fillText).toHaveBeenCalled();
  });

  it('should return the cached texture on a second call with the same node, without re-rendering', () => {
    // mock
    const fillText = vi.fn();
    const context = {
      fillStyle: '',
      fillText,
      font: '',
      measureText: (text: string): { width: number } => ({ width: text.length * 5 }),
      scale: vi.fn(),
      textBaseline: '',
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);

    const gl = createGlMock();
    const cache = new Map<string, WebGLTexture>();
    const node = createNode();

    // before
    const first = getOrCreateTextTexture(gl, cache, node);

    fillText.mockClear();

    const second = getOrCreateTextTexture(gl, cache, node);

    // result
    expect(second).toBe(first);
    expect(cache.size).toBe(1);
    expect(fillText).not.toHaveBeenCalled();
  });

  it('should render a fresh texture when the content changes', () => {
    // mock
    const context = {
      fillStyle: '',
      fillText: vi.fn(),
      font: '',
      measureText: (text: string): { width: number } => ({ width: text.length * 5 }),
      scale: vi.fn(),
      textBaseline: '',
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);

    const gl = createGlMock();
    const cache = new Map<string, WebGLTexture>();

    // before
    getOrCreateTextTexture(gl, cache, createNode({ content: 'hello' }));
    getOrCreateTextTexture(gl, cache, createNode({ content: 'goodbye' }));

    // result
    expect(cache.size).toBe(2);
  });

  it('should return null when the WebGL context fails to create a texture', () => {
    // mock
    const context = {
      fillStyle: '',
      fillText: vi.fn(),
      font: '',
      measureText: (text: string): { width: number } => ({ width: text.length * 5 }),
      scale: vi.fn(),
      textBaseline: '',
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);

    const gl = createGlMock(null);
    const cache = new Map<string, WebGLTexture>();

    // before
    const texture = getOrCreateTextTexture(gl, cache, createNode());

    // result
    expect(texture).toBeNull();
    expect(cache.size).toBe(0);
  });

  it('should fall back to a device pixel ratio of 1 when devicePixelRatio is unset', () => {
    // mock
    vi.stubGlobal('devicePixelRatio', 0);

    const context = {
      fillStyle: '',
      fillText: vi.fn(),
      font: '',
      measureText: (text: string): { width: number } => ({ width: text.length * 5 }),
      scale: vi.fn(),
      textBaseline: '',
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);

    const gl = createGlMock();
    const cache = new Map<string, WebGLTexture>();

    // before
    const texture = getOrCreateTextTexture(gl, cache, createNode());

    // result
    expect(texture).not.toBeNull();
  });

  it('should fall back to unwrapped content when the measuring canvas has no 2D context', () => {
    // mock
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    const gl = createGlMock();
    const cache = new Map<string, WebGLTexture>();

    // before / result — must not throw despite no context being available anywhere
    expect(() => getOrCreateTextTexture(gl, cache, createNode())).not.toThrow();
  });
});
