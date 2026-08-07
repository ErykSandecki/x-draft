// types
import { TPoint } from 'types/canvas';
import { TSceneNode } from 'types/design/types';

// utils
import { isPointInRect } from '../../../utils/isPointInRect';

export const getNodeAtPoint = (point: TPoint, nodes: TSceneNode[]): TSceneNode | null => {
  const hit = [...nodes].reverse().find((node) => isPointInRect(point, node));

  return hit ?? null;
};
