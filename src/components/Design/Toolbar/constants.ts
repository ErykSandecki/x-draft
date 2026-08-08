// assets
import { Icons } from 'assets/svg';

// others
import { translationNameSpace as parentNameSpace } from '../constants';

// types
import { ToolName } from 'types/design/enums';

export const translationNameSpace = `${parentNameSpace}.toolbar`;

export const TOOL_ICON: Record<ToolName, keyof typeof Icons> = {
  [ToolName.default]: 'MoveTool',
  [ToolName.frame]: 'FrameTool',
  [ToolName.rectangle]: 'RectangleTool',
  [ToolName.comment]: 'Comment',
};

export const TOOL_LABEL: Record<ToolName, string> = {
  [ToolName.comment]: `${translationNameSpace}.tool.comment`,
  [ToolName.default]: `${translationNameSpace}.tool.default`,
  [ToolName.frame]: `${translationNameSpace}.tool.frame`,
  [ToolName.rectangle]: `${translationNameSpace}.tool.rectangle`,
};

export const TOOLS_WITH_DROPDOWN: ToolName[] = [ToolName.default, ToolName.frame, ToolName.rectangle];

export const TOOLBAR_ORDER: ToolName[] = [ToolName.default, ToolName.frame, ToolName.rectangle, ToolName.comment];
