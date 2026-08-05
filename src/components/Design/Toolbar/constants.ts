// assets
import { Icons } from 'assets/svg';

// types
import { ToolName } from 'types/design/enums';

export const TOOL_ICON: Record<ToolName, keyof typeof Icons> = {
  [ToolName.default]: 'MoveTool',
  [ToolName.frame]: 'FrameTool',
};
