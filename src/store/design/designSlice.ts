import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

// others
import { DEFAULT_TOOL, DEFAULT_VIEWPORT } from './constants';

// types
import { TDesignState } from './types';
import { ToolName } from 'types/design/enums';
import { TSceneNode, TViewport } from 'types/design/types';

const initialState: TDesignState = {
  activeTool: DEFAULT_TOOL,
  nodes: {},
  rootOrder: [],
  viewport: DEFAULT_VIEWPORT,
};

const designSlice = createSlice({
  initialState,
  name: 'design',
  reducers: {
    addNode: {
      prepare: (node: Omit<TSceneNode, 'id'>) => ({ payload: { ...node, id: nanoid() } as TSceneNode }),
      reducer: (state, action: PayloadAction<TSceneNode>) => {
        state.nodes[action.payload.id] = action.payload;
        state.rootOrder.push(action.payload.id);
      },
    },
    setActiveTool: (state, action: PayloadAction<ToolName>) => {
      state.activeTool = action.payload;
    },
    setViewport: (state, action: PayloadAction<TViewport>) => {
      state.viewport = action.payload;
    },
    updateNode: (state, action: PayloadAction<{ changes: Partial<TSceneNode>; id: string }>) => {
      const node = state.nodes[action.payload.id];

      if (node) {
        Object.assign(node, action.payload.changes);
      }
    },
  },
});

export const { addNode, setActiveTool, setViewport, updateNode } = designSlice.actions;

export default designSlice.reducer;
