// others
import { IMAGE_PREVIEW_MAX_SIZE_PX, IMAGE_PREVIEW_OFFSET_PX } from '../../../../constants';

// types
import { TDraftRect } from 'types/canvas';
import { TImageRenderContext, TMediaPreview } from '../../types';
import { TViewport } from 'types/design/types';

// utils
import { drawImage } from 'utils/canvas/drawImage';
import { getOrLoadTexture } from 'utils/canvas/getOrLoadTexture';
import { screenToWorld } from '../../../../utils/screenToWorld';

export const drawMediaPreview = (
  gl: WebGL2RenderingContext,
  imageContext: TImageRenderContext,
  mediaPreview: TMediaPreview | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  viewport: TViewport,
): void => {
  if (mediaPreview) {
    const previewWidthPx = mediaPreview.aspectRatio >= 1 ? IMAGE_PREVIEW_MAX_SIZE_PX : IMAGE_PREVIEW_MAX_SIZE_PX * mediaPreview.aspectRatio;
    const previewHeightPx =
      mediaPreview.aspectRatio >= 1 ? IMAGE_PREVIEW_MAX_SIZE_PX / mediaPreview.aspectRatio : IMAGE_PREVIEW_MAX_SIZE_PX;
    const origin = screenToWorld(
      { x: mediaPreview.point.x + IMAGE_PREVIEW_OFFSET_PX.x, y: mediaPreview.point.y + IMAGE_PREVIEW_OFFSET_PX.y },
      viewport,
    );
    const rect: TDraftRect = {
      height: previewHeightPx / viewport.zoom,
      width: previewWidthPx / viewport.zoom,
      x: origin.x,
      y: origin.y,
    };

    drawImage(
      gl,
      imageContext.program,
      imageContext.buffer,
      getOrLoadTexture(gl, imageContext.cache, mediaPreview.src),
      rect,
      canvasWidth,
      canvasHeight,
      viewport,
    );
  }
};
