// utils
import { loadArmedMedia } from '../loadArmedMedia';

type TFakeImage = { naturalHeight: number; naturalWidth: number; onload: (() => void) | null; src: string };

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

describe('loadArmedMedia', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should report the object URL and natural dimensions once the image loads', () => {
    // mock
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    const { getLastImage } = stubImageConstructor();
    const onLoad = vi.fn();
    const file = new File(['x'], 'photo.png', { type: 'image/png' });

    // before
    loadArmedMedia(file, onLoad);

    const image = getLastImage();

    image.naturalWidth = 200;
    image.naturalHeight = 100;

    // action
    image.onload?.();

    // result
    expect(image.src).toBe('blob:mock-url');
    expect(onLoad).toHaveBeenCalledWith({ naturalHeight: 100, naturalWidth: 200, src: 'blob:mock-url' });
  });
});
