import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

// others
import { DEFAULT_TOOL, DEFAULT_VIEWPORT } from './constants';

// types
import { TDesignState } from './types';
import { ToolName } from 'types/design/enums';
import { TSceneNode, TViewport } from 'types/design/types';

// utils
import { handleAddNode } from './utils/handleAddNode';
import { handleUpdateNode } from './utils/handleUpdateNode';

const initialState: TDesignState = {
  activeTool: DEFAULT_TOOL,
  nodes: {},
  rootOrder: [],
  selectedIds: [],
  viewport: DEFAULT_VIEWPORT,
};

const designSlice = createSlice({
  initialState,
  name: 'design',
  reducers: {
    addNode: {
      prepare: (node: Omit<TSceneNode, 'id'>) => ({ payload: { ...node, id: nanoid() } as TSceneNode }),
      reducer: (state, action: PayloadAction<TSceneNode>) => handleAddNode(state, action.payload),
    },
    setActiveTool: (state, action: PayloadAction<ToolName>) => {
      state.activeTool = action.payload;
    },
    setSelection: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    setViewport: (state, action: PayloadAction<TViewport>) => {
      state.viewport = action.payload;
    },
    updateNode: (state, action: PayloadAction<{ changes: Partial<TSceneNode>; id: string }>) => handleUpdateNode(state, action.payload),
  },
});

export const { addNode, setActiveTool, setSelection, setViewport, updateNode } = designSlice.actions;

export default designSlice.reducer;
