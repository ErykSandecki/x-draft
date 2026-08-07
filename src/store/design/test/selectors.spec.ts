// selectors
import {
  selectActiveTool,
  selectNodes,
  selectOrderedNodes,
  selectSelectedIds,
  selectSelectedNodes,
  selectViewport,
} from '../selectors';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { TSceneNode } from 'types/design/types';

const node: TSceneNode = {
  fill: '#ff0000',
  height: 10,
  id: 'node-1',
  name: 'Frame 1',
  parentId: null,
  rotation: 0,
  type: NodeType.frame,
  width: 10,
  x: 0,
  y: 0,
};

const state = {
  design: {
    activeTool: ToolName.frame,
    nodes: { [node.id]: node },
    rootOrder: [node.id],
    selectedIds: [node.id],
    viewport: { x: 5, y: 10, zoom: 2 },
  },
} as any;

describe('design selectors', () => {
  it('should select the active tool', () => {
    // result
    expect(selectActiveTool(state)).toBe(ToolName.frame);
  });

  it('should select the nodes record', () => {
    // result
    expect(selectNodes(state)).toEqual({ [node.id]: node });
  });

  it('should select the nodes in root order', () => {
    // result
    expect(selectOrderedNodes(state)).toEqual([node]);
  });

  it('should select the viewport', () => {
    // result
    expect(selectViewport(state)).toEqual({ x: 5, y: 10, zoom: 2 });
  });

  it('should select the selected ids', () => {
    // result
    expect(selectSelectedIds(state)).toEqual([node.id]);
  });

  it('should select the selected nodes', () => {
    // result
    expect(selectSelectedNodes(state)).toEqual([node]);
  });
});
