// types
import { ToolName } from 'types/design/enums';
import { TSceneNode, TViewport } from 'types/design/types';

export type TDesignState = {
  activeTool: ToolName;
  lastShapeTool: ToolName;
  nodes: Record<string, TSceneNode>;
  rootOrder: string[];
  selectedIds: string[];
  viewport: TViewport;
};
