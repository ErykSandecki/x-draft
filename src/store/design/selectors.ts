// store
import { RootState } from 'store';

// types
import { ToolName } from 'types/design/enums';

export const selectActiveTool = (state: RootState): ToolName => state.design.activeTool;
