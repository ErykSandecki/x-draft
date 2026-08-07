// store
import slice, { addNode, setActiveTool, setSelection, setViewport, updateNode } from '../slice';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { TSceneNode } from 'types/design/types';

const frameNodePayload: Omit<TSceneNode, 'id'> = {
  fill: '#ff0000',
  height: 100,
  name: 'Frame 1',
  parentId: null,
  rotation: 0,
  type: NodeType.frame,
  width: 200,
  x: 0,
  y: 0,
};

describe('design slice', () => {
  it('should return the initial state', () => {
    // result
    expect(slice(undefined, { type: 'unknown' })).toEqual({
      activeTool: ToolName.default,
      nodes: {},
      rootOrder: [],
      selectedIds: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    });
  });

  it('should set the active tool', () => {
    // before
    const state = slice(undefined, setActiveTool(ToolName.frame));

    // result
    expect(state.activeTool).toBe(ToolName.frame);
  });

  it('should add a node with a generated id', () => {
    // before
    const state = slice(undefined, addNode(frameNodePayload));
    const [id] = state.rootOrder;

    // result
    expect(state.rootOrder).toHaveLength(1);
    expect(state.nodes[id]).toEqual({ ...frameNodePayload, id });
  });

  it('should update an existing node', () => {
    // before
    const withNode = slice(undefined, addNode(frameNodePayload));
    const [id] = withNode.rootOrder;

    // action
    const state = slice(withNode, updateNode({ changes: { width: 300 }, id }));

    // result
    expect(state.nodes[id].width).toBe(300);
  });

  it('should do nothing when updating a node that does not exist', () => {
    // before
    const state = slice(undefined, updateNode({ changes: { width: 300 }, id: 'missing' }));

    // result
    expect(state.nodes).toEqual({});
  });

  it('should set the viewport', () => {
    // before
    const state = slice(undefined, setViewport({ x: 10, y: 20, zoom: 2 }));

    // result
    expect(state.viewport).toEqual({ x: 10, y: 20, zoom: 2 });
  });

  it('should set the selection', () => {
    // before
    const state = slice(undefined, setSelection(['a', 'b']));

    // result
    expect(state.selectedIds).toEqual(['a', 'b']);
  });
});
