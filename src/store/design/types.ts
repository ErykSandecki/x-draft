// types
import { ToolName } from 'types/design/enums';
import { TSceneNode, TViewport } from 'types/design/types';

export type TDesignState = {
  activeTool: ToolName;
  nodes: Record<string, TSceneNode>;
  rootOrder: string[];
  viewport: TViewport;
};
