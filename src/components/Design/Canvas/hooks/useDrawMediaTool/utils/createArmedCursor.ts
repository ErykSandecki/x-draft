// assets
import pointerCursorUrl from 'assets/icons/cursors/pointer.png';

const COMPOSITE_SIZE_PX = 512;
const CROSSHAIR_SIZE_PX = 256;
const THUMBNAIL_MAX_SIZE_PX = 256;
const THUMBNAIL_OFFSET_PX = 192;

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image();

    image.onload = (): void => resolve(image);
    image.src = src;
  });

export const createArmedCursor = (imageSrc: string, onReady: (cursorValue: string) => void): void => {
  Promise.all([loadImage(pointerCursorUrl), loadImage(imageSrc)]).then(([crosshair, thumbnail]) => {
    const canvas = document.createElement('canvas');

    canvas.width = COMPOSITE_SIZE_PX;
    canvas.height = COMPOSITE_SIZE_PX;

    const context = canvas.getContext('2d');

    if (context) {
      const scale = Math.min(THUMBNAIL_MAX_SIZE_PX / thumbnail.naturalWidth, THUMBNAIL_MAX_SIZE_PX / thumbnail.naturalHeight);

      context.drawImage(crosshair, 0, 0, CROSSHAIR_SIZE_PX, CROSSHAIR_SIZE_PX);
      context.drawImage(
        thumbnail,
        THUMBNAIL_OFFSET_PX,
        THUMBNAIL_OFFSET_PX,
        thumbnail.naturalWidth * scale,
        thumbnail.naturalHeight * scale,
      );

      onReady(`-webkit-image-set(url(${canvas.toDataURL()}) 8x) 16 16, auto`);
    }
  });
};
