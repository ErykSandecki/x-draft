// others
import { SHAPE_TOOLS } from '../constants';

// types
import { TDesignState } from '../types';
import { ToolName } from 'types/design/enums';

export const handleSetActiveTool = (state: TDesignState, tool: ToolName): void => {
  state.activeTool = tool;

  if (SHAPE_TOOLS.includes(tool)) {
    state.lastShapeTool = tool;
  }
};
