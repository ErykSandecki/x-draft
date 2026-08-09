// others
import { LINE_HIT_TOLERANCE_PX } from 'constant/canvas';

// types
import { NodeType } from 'types/design/enums';
import { TPoint } from 'types/canvas';
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { isPointInEllipse } from './isPointInEllipse';
import { isPointInRect } from './isPointInRect';
import { isPointNearLine } from './isPointNearLine';

export const getNodeAtPoint = (point: TPoint, nodes: TSceneNode[], viewport: TViewport): TSceneNode | null => {
  const lineTolerance = LINE_HIT_TOLERANCE_PX / viewport.zoom;

  const hit = [...nodes].reverse().find((node) => {
    if (node.type === NodeType.ellipse) {
      return isPointInEllipse(point, node);
    }

    if (node.type === NodeType.line) {
      return isPointNearLine(point, node, lineTolerance);
    }

    return isPointInRect(point, node);
  });

  return hit ?? null;
};
