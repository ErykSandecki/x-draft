// hooks
import { TShapeToolConfig } from './hooks/useDrawShapeTool/useDrawShapeTool';

// others
import { FRAME_FILL, RECTANGLE_FILL } from './constants';

// types
import { NodeType, ToolName } from 'types/design/enums';

export const FRAME_TOOL_SETTINGS: TShapeToolConfig = { fill: FRAME_FILL, name: 'Frame', tool: ToolName.frame, type: NodeType.frame };
export const RECTANGLE_TOOL_SETTINGS: TShapeToolConfig = { fill: RECTANGLE_FILL, name: 'Rectangle', tool: ToolName.rectangle, type: NodeType.rectangle };
