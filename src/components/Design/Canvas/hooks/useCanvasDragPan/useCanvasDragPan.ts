import { RefObject, useEffect, useRef } from 'react';

// store
import { setViewport } from 'store/design/designSlice';
import { selectViewport } from 'store/design/selectors';
import { store, useAppDispatch } from 'store';

// styles
import styles from '../../canvas.module.scss';

// types
import { TPoint } from '../../types';

// utils
import { applyDragPan } from './utils/applyDragPan';
import { getPointerPosition } from '../../utils/getPointerPosition';

const MIDDLE_MOUSE_BUTTON = 1;

export const useCanvasDragPan = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  const dispatch = useAppDispatch();
  const lastPointRef = useRef<TPoint | null>(null);

  const handlePointerDown = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (event.button === MIDDLE_MOUSE_BUTTON) {
      event.preventDefault();
      lastPointRef.current = getPointerPosition(canvas, event);
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add(styles['Canvas__canvas-element--pressing']);
    }
  };

  const handlePointerMove = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (lastPointRef.current) {
      const point = getPointerPosition(canvas, event);
      const viewport = selectViewport(store.getState());

      dispatch(
        setViewport(applyDragPan(viewport, point.x - lastPointRef.current.x, point.y - lastPointRef.current.y)),
      );
      lastPointRef.current = point;
    }
  };

  const handlePointerUp = (canvas: HTMLCanvasElement, event: PointerEvent): void => {
    if (lastPointRef.current) {
      lastPointRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
      canvas.classList.remove(styles['Canvas__canvas-element--pressing']);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const onPointerDown = (event: PointerEvent): void => handlePointerDown(canvas, event);
      const onPointerMove = (event: PointerEvent): void => handlePointerMove(canvas, event);
      const onPointerUp = (event: PointerEvent): void => handlePointerUp(canvas, event);

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);

      return (): void => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
      };
    }
  }, [canvasRef, dispatch]);
};
