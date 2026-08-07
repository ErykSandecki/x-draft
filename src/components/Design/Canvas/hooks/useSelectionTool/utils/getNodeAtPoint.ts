// types
import { TPoint } from '../../../types';
import { TSceneNode } from 'types/design/types';

const containsPoint = (node: TSceneNode, point: TPoint): boolean =>
  point.x >= node.x && point.x <= node.x + node.width && point.y >= node.y && point.y <= node.y + node.height;

export const getNodeAtPoint = (point: TPoint, nodes: TSceneNode[]): TSceneNode | null => {
  const hit = [...nodes].reverse().find((node) => containsPoint(node, point));

  return hit ?? null;
};
