// types
import { TDraftRect } from 'types/canvas';
import { TSceneNode } from 'types/design/types';

export const getSelectionBounds = (nodes: TSceneNode[]): TDraftRect => {
  const minX = Math.min(...nodes.map((node) => node.x));
  const minY = Math.min(...nodes.map((node) => node.y));
  const maxX = Math.max(...nodes.map((node) => node.x + node.width));
  const maxY = Math.max(...nodes.map((node) => node.y + node.height));

  return { height: maxY - minY, width: maxX - minX, x: minX, y: minY };
};
