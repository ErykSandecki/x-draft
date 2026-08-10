import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, renderHook } from '@testing-library/react';
import { RefObject } from 'react';

// hooks
import { useDrawMediaTool, TMediaToolConfig } from './useDrawMediaTool';

// store
import designReducer, { setActiveTool } from 'store/design/slice';
import { TDesignState } from 'store/design/types';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { TDraftEntity } from 'types/design/types';
import { TMediaPreview } from '../useCanvasRenderLoop/types';

type TFakeImage = { naturalHeight: number; naturalWidth: number; onload: (() => void) | null; src: string };

const CONFIG: TMediaToolConfig = { name: 'Image', tool: ToolName.media };

const createTestStore = (): EnhancedStore<{ design: TDesignState }> => configureStore({ reducer: { design: designReducer } });

const createCanvasRef = (): RefObject<HTMLCanvasElement | null> => {
  const canvas = document.createElement('canvas');

  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0 } as DOMRect);

  // jsdom doesn't implement pointer capture on elements
  canvas.setPointerCapture = vi.fn();
  canvas.releasePointerCapture = vi.fn();

  return { current: canvas };
};

const stubImageConstructor = (): { getLastImage: () => TFakeImage } => {
  let lastImage: TFakeImage = { naturalHeight: 0, naturalWidth: 0, onload: null, src: '' };

  vi.stubGlobal(
    'Image',
    vi.fn(function FakeImage() {
      lastImage = { naturalHeight: 0, naturalWidth: 0, onload: null, src: '' };
      return lastImage;
    }),
  );

  return { getLastImage: () => lastImage };
};

const captureInput = (): { getInput: () => HTMLInputElement } => {
  const originalCreateElement = document.createElement.bind(document);
  let capturedInput: HTMLInputElement | null = null;

  vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
    const element = originalCreateElement(tagName);

    if (tagName === 'input') {
      capturedInput = element as HTMLInputElement;
      vi.spyOn(capturedInput, 'click').mockImplementation(() => undefined);
    }

    return element;
  });

  return {
    getInput: (): HTMLInputElement => {
      if (!capturedInput) {
        throw new Error('input was not created');
      }

      return capturedInput;
    },
  };
};

const selectFile = (input: HTMLInputElement, files: File[] | null): void => {
  Object.defineProperty(input, 'files', { configurable: true, value: files });
  input.dispatchEvent(new Event('change'));
};

const armMedia = (input: HTMLInputElement, getLastImage: () => TFakeImage, naturalWidth: number, naturalHeight: number): void => {
  selectFile(input, [new File(['x'], 'photo.png', { type: 'image/png' })]);

  const image = getLastImage();

  image.naturalWidth = naturalWidth;
  image.naturalHeight = naturalHeight;
  image.onload?.();
};

const pointerEvent = (type: string, x: number, y: number, button = 0): PointerEvent =>
  new PointerEvent(type, { button, clientX: x, clientY: y, pointerId: 1 });

const renderMediaTool = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draftRef: RefObject<TDraftEntity | null>,
  mediaPreviewRef: RefObject<TMediaPreview | null>,
  store: EnhancedStore<{ design: TDesignState }>,
): void => {
  renderHook(() => useDrawMediaTool(canvasRef, draftRef, mediaPreviewRef, CONFIG), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe('useDrawMediaTool behaviors', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should not open a file picker when the tool is not active', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getInput } = captureInput();

    // before
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);

    // result
    expect(() => getInput()).toThrow();
  });

  it('should open an image file picker as soon as the tool activates', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));

    // before
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);

    // result
    const input = getInput();

    expect(input.accept).toBe('image/*');
    expect(input.click).toHaveBeenCalledTimes(1);
  });

  it('should revert to the default tool when the file picker is cancelled', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);

    // action
    act(() => getInput().dispatchEvent(new Event('cancel')));

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.default);
  });

  it('should ignore a change event with no file selected', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);

    // action
    selectFile(getInput(), null);
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 10, 10));
    canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 10, 10));

    // result
    expect(store.getState().design.rootOrder).toHaveLength(0);
  });

  it('should not react to pointer events before a file is chosen', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };

    captureInput();
    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 10, 10));
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 60, 60));

    // result
    expect(draftRef.current).toBeNull();
    expect(mediaPreviewRef.current).toBeNull();
  });

  it('should ignore a non-primary button press once armed', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getLastImage } = stubImageConstructor();
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);
    armMedia(getInput(), getLastImage, 200, 100);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 10, 10, 1));
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 60, 60, 1));

    // result
    expect(draftRef.current).toBeNull();
  });

  it('should show a floating preview while armed and hovering, clearing once a drag starts', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getLastImage } = stubImageConstructor();
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);
    armMedia(getInput(), getLastImage, 200, 100);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 30, 40));

    // result
    expect(mediaPreviewRef.current).toEqual({ aspectRatio: 2, point: { x: 30, y: 40 }, src: 'blob:mock-url' });

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 30, 40));

    // result
    expect(mediaPreviewRef.current).toBeNull();
  });

  it('should show a live aspect-ratio-locked draft while dragging', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getLastImage } = stubImageConstructor();
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);
    armMedia(getInput(), getLastImage, 200, 100);

    // action
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 0, 0));
    canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 50, 50));

    // result — raw 50x50 drag locked to a 2:1 ratio, driven by the taller raw axis
    expect(draftRef.current).toEqual({ height: 50, src: 'blob:mock-url', type: NodeType.media, width: 100, x: 0, y: 0 });
  });

  it('should place the image at its natural size on a plain click', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getLastImage } = stubImageConstructor();
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);
    armMedia(getInput(), getLastImage, 200, 100);

    // action
    act(() => {
      canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 10, 10));
      canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 10, 10));
    });

    // result
    const { design } = store.getState();

    expect(design.rootOrder).toHaveLength(1);
    expect(design.nodes[design.rootOrder[0]]).toMatchObject({
      height: 100,
      name: 'Image',
      src: 'blob:mock-url',
      type: NodeType.media,
      width: 200,
      x: 10,
      y: 10,
    });
    expect(design.activeTool).toBe(ToolName.default);
    expect(draftRef.current).toBeNull();
    expect(mediaPreviewRef.current).toBeNull();
  });

  it('should place an aspect-ratio-locked custom size on a drag', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getLastImage } = stubImageConstructor();
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);
    armMedia(getInput(), getLastImage, 200, 100);

    // action
    act(() => {
      canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 0, 0));
      canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 50, 50));
      canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 50, 50));
    });

    // result — the raw 50x50 drag does not match the 2:1 source ratio, so it must be locked
    const { design } = store.getState();

    expect(design.nodes[design.rootOrder[0]]).toMatchObject({ height: 50, width: 100, x: 0, y: 0 });
  });

  it('should place a click natural-size image, then an aspect-locked dragged image, from a multi-file selection', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getLastImage } = stubImageConstructor();
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);

    // before — pick two files at once
    selectFile(getInput(), [new File(['a'], 'first.png', { type: 'image/png' }), new File(['b'], 'second.png', { type: 'image/png' })]);

    const firstImage = getLastImage();

    firstImage.naturalWidth = 200;
    firstImage.naturalHeight = 100;
    firstImage.onload?.();

    // action — place the first file with a plain click
    act(() => {
      canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 10, 10));
      canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 10, 10));
    });

    // result — one node placed, tool stays on media with the second file now armed
    expect(store.getState().design.rootOrder).toHaveLength(1);
    expect(store.getState().design.activeTool).toBe(ToolName.media);

    const secondImage = getLastImage();

    secondImage.naturalWidth = 50;
    secondImage.naturalHeight = 100;
    secondImage.onload?.();

    // action — place the second file with a drag
    act(() => {
      canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 40, 40));
      canvasRef.current?.dispatchEvent(pointerEvent('pointermove', 90, 65));
      canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 90, 65));
    });

    // result — both files placed, tool reverts to default once the queue is empty
    const { design } = store.getState();

    expect(design.rootOrder).toHaveLength(2);
    expect(design.nodes[design.rootOrder[0]]).toMatchObject({ height: 100, width: 200, x: 10, y: 10 });
    // raw 50x25 drag locked to the second file's 1:2 ratio (twice as tall as wide) — the raw
    // height (25) is far too short for that ratio, so it gets forced up to 100
    expect(design.nodes[design.rootOrder[1]]).toMatchObject({ height: 100, width: 50, x: 40, y: 40 });
    expect(design.activeTool).toBe(ToolName.default);
  });

  it('should not place a stale armed file after the tool is deactivated and reactivated without picking a new one', () => {
    // mock
    const store = createTestStore();
    const canvasRef = createCanvasRef();
    const draftRef: RefObject<TDraftEntity | null> = { current: null };
    const mediaPreviewRef: RefObject<TMediaPreview | null> = { current: null };
    const { getLastImage } = stubImageConstructor();
    const { getInput } = captureInput();

    store.dispatch(setActiveTool(CONFIG.tool));
    renderMediaTool(canvasRef, draftRef, mediaPreviewRef, store);
    armMedia(getInput(), getLastImage, 200, 100);

    // action
    act(() => store.dispatch(setActiveTool(ToolName.default)));
    act(() => store.dispatch(setActiveTool(CONFIG.tool)));
    canvasRef.current?.dispatchEvent(pointerEvent('pointerdown', 10, 10));
    canvasRef.current?.dispatchEvent(pointerEvent('pointerup', 10, 10));

    // result
    expect(store.getState().design.rootOrder).toHaveLength(0);
  });
});
