import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// others
import { DEFAULT_TOOL } from './constants';

// types
import { TDesignState } from './types';
import { ToolName } from 'types/design/enums';

const initialState: TDesignState = {
  activeTool: DEFAULT_TOOL,
};

const designSlice = createSlice({
  initialState,
  name: 'design',
  reducers: {
    setActiveTool: (state, action: PayloadAction<ToolName>) => {
      state.activeTool = action.payload;
    },
  },
});

export const { setActiveTool } = designSlice.actions;

export default designSlice.reducer;
