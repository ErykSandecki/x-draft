import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

// others
import { DEFAULT_MOUSE_TOOL, DEFAULT_SHAPE_TOOL, DEFAULT_TOOL, DEFAULT_VIEWPORT } from './constants';

// types
import { TDesignState } from './types';
import { TEditingTextBox } from 'types/canvas';
import { ToolName } from 'types/design/enums';
import { TNewSceneNode, TSceneNode, TSceneNodeChanges, TViewport } from 'types/design/types';

// utils
import { handleAddNode } from './utils/handleAddNode';
import { handleSetActiveTool } from './utils/handleSetActiveTool';
import { handleUpdateNode } from './utils/handleUpdateNode';

const initialState: TDesignState = {
  activeTool: DEFAULT_TOOL,
  editingTextBox: null,
  lastMouseTool: DEFAULT_MOUSE_TOOL,
  lastShapeTool: DEFAULT_SHAPE_TOOL,
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
      prepare: (node: TNewSceneNode) => ({ payload: { ...node, id: nanoid() } as TSceneNode }),
      reducer: (state, action: PayloadAction<TSceneNode>) => handleAddNode(state, action.payload),
    },
    setActiveTool: (state, action: PayloadAction<ToolName>) => handleSetActiveTool(state, action.payload),
    setSelection: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    setViewport: (state, action: PayloadAction<TViewport>) => {
      state.viewport = action.payload;
    },
    startTextEdit: (state, action: PayloadAction<TEditingTextBox>) => {
      state.editingTextBox = action.payload;
    },
    stopTextEdit: (state) => {
      state.editingTextBox = null;
    },
    updateNode: (state, action: PayloadAction<{ changes: TSceneNodeChanges; id: string }>) => handleUpdateNode(state, action.payload),
  },
});

export const { addNode, setActiveTool, setSelection, setViewport, startTextEdit, stopTextEdit, updateNode } = designSlice.actions;

export default designSlice.reducer;
