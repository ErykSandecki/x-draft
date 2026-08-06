// types
import { TDraftRect } from '../types';

export type TPoint = {
  x: number;
  y: number;
};

export const getRectCorners = (rect: TDraftRect): [TPoint, TPoint, TPoint, TPoint] => [
  { x: rect.x, y: rect.y },
  { x: rect.x + rect.width, y: rect.y },
  { x: rect.x + rect.width, y: rect.y + rect.height },
  { x: rect.x, y: rect.y + rect.height },
];
