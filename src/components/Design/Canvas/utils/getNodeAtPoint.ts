// types
import { NodeType } from 'types/design/enums';
import { TPoint } from 'types/canvas';
import { TSceneNode } from 'types/design/types';

// utils
import { isPointInEllipse } from './isPointInEllipse';
import { isPointInRect } from './isPointInRect';

export const getNodeAtPoint = (point: TPoint, nodes: TSceneNode[]): TSceneNode | null => {
  const hit = [...nodes]
    .reverse()
    .find((node) => (node.type === NodeType.ellipse ? isPointInEllipse(point, node) : isPointInRect(point, node)));

  return hit ?? null;
};
