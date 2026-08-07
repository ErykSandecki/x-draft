// types
import { TPoint } from '../types';
import { TViewport } from 'types/design/types';

export const screenToWorld = (point: TPoint, viewport: TViewport): TPoint => ({
  x: (point.x - viewport.x) / viewport.zoom,
  y: (point.y - viewport.y) / viewport.zoom,
});
