// types
import { TPoint } from '../types';

export const getPointerPosition = (canvas: HTMLCanvasElement, event: PointerEvent): TPoint => {
  const rect = canvas.getBoundingClientRect();

  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
};
