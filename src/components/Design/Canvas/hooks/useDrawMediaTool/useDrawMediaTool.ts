import { RefObject, useEffect, useRef } from 'react';

// others
import { MIN_SHAPE_SIZE } from '../../constants';

// store
import { addNode, setActiveTool, setSelection } from 'store/design/slice';
import { selectActiveTool, selectViewport } from 'store/design/selectors';
import { useAppDispatch, useAppSelector } from 'store';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { MouseButton } from 'types/enums';
import { TArmedMedia } from './utils/loadArmedMedia';
import { TDraftEntity } from 'types/design/types';
import { TMediaPreview } from '../useCanvasRenderLoop/types';
import { TPoint } from 'types/canvas';

// utils
import { getAspectRatioLockedRect } from 'utils/math/getAspectRatioLockedRect';
import { getPointerPosition } from '../../utils/getPointerPosition';
import { loadArmedMedia } from './utils/loadArmedMedia';
import { screenToWorld } from '../../utils/screenToWorld';

export type TMediaToolConfig = {
  name: string;
  tool: ToolName;
};

export const useDrawMediaTool = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draftRef: RefObject<TDraftEntity | null>,
  mediaPreviewRef: RefObject<TMediaPreview | null>,
  { name, tool }: TMediaToolConfig,
): void => {
  const activeTool = useAppSelector(selectActiveTool);
  const viewport = useAppSelector(selectViewport);
  const dispatch = useAppDispatch();
  const startRef = useRef<TPoint | null>(null);
  const armedRef = useRef<TArmedMedia | null>(null);

  const handlePointerDown = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (event.button === MouseButton.primary && armedRef.current) {
      dispatch(setSelection([]));
      startRef.current = screenToWorld(getPointerPosition(canvas, event), viewport);
      mediaPreviewRef.current = null;
      canvas.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    const armed = armedRef.current;

    if (armed) {
      const point = getPointerPosition(canvas, event);

      if (startRef.current) {
        const current = screenToWorld(point, viewport);
        const rect = getAspectRatioLockedRect(startRef.current, current, armed.naturalWidth / armed.naturalHeight);

        draftRef.current = { ...rect, src: armed.src, type: NodeType.media };
      } else {
        mediaPreviewRef.current = { aspectRatio: armed.naturalWidth / armed.naturalHeight, point, src: armed.src };
      }
    }
  };

  const handlePointerUp = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    const armed = armedRef.current;

    if (armed && startRef.current) {
      const current = screenToWorld(getPointerPosition(canvas, event), viewport);
      const isClick =
        Math.abs(current.x - startRef.current.x) < MIN_SHAPE_SIZE && Math.abs(current.y - startRef.current.y) < MIN_SHAPE_SIZE;
      const rect = isClick
        ? { height: armed.naturalHeight, width: armed.naturalWidth, x: startRef.current.x, y: startRef.current.y }
        : getAspectRatioLockedRect(startRef.current, current, armed.naturalWidth / armed.naturalHeight);

      dispatch(addNode({ ...rect, name, parentId: null, rotation: 0, src: armed.src, type: NodeType.media }));

      startRef.current = null;
      armedRef.current = null;
      draftRef.current = null;
      mediaPreviewRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
      dispatch(setActiveTool(ToolName.default));
    }
  };

  const handleFileChange = (event: Event): void => {
    const [file] = (event.target as HTMLInputElement).files ?? [];

    if (file) {
      loadArmedMedia(file, (armed) => {
        armedRef.current = armed;
      });
    }
  };

  const handleFileCancel = (): void => {
    dispatch(setActiveTool(ToolName.default));
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && activeTool === tool) {
      const input = document.createElement('input');
      const onPointerDown = (event: PointerEvent): void => handlePointerDown(canvas, event);
      const onPointerMove = (event: PointerEvent): void => handlePointerMove(canvas, event);
      const onPointerUp = (event: PointerEvent): void => handlePointerUp(canvas, event);

      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', handleFileChange);
      input.addEventListener('cancel', handleFileCancel);
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      input.click();

      return (): void => {
        input.removeEventListener('change', handleFileChange);
        input.removeEventListener('cancel', handleFileCancel);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        startRef.current = null;
        armedRef.current = null;
        draftRef.current = null;
        mediaPreviewRef.current = null;
      };
    }
  }, [activeTool, canvasRef, dispatch, draftRef, mediaPreviewRef, name, tool, viewport]);
};
