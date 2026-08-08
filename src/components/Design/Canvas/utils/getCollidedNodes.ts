// types
import { TDraftRect } from 'types/canvas';
import { TSceneNode } from 'types/design/types';

export const getCollidedNodes = (nodes: TSceneNode[], area: TDraftRect, requireFullyInside: boolean): TSceneNode[] => {
  const x1 = area.x;
  const y1 = area.y;
  const x2 = area.x + area.width;
  const y2 = area.y + area.height;

  return nodes.filter((node) => {
    const nodeX2 = node.x + node.width;
    const nodeY2 = node.y + node.height;

    return requireFullyInside
      ? x1 <= node.x && x2 >= nodeX2 && y1 <= node.y && y2 >= nodeY2
      : !(nodeX2 < x1 || node.x > x2 || nodeY2 < y1 || node.y > y2);
  });
};
