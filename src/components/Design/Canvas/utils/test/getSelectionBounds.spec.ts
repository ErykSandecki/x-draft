// types
import { NodeType } from 'types/design/enums';
import { TSceneNode } from 'types/design/types';

// utils
import { getSelectionBounds } from '../getSelectionBounds';

const buildNode = (overrides: Partial<TSceneNode>): TSceneNode => ({
  fill: '#ff0000',
  height: 10,
  id: 'node',
  name: 'Frame',
  parentId: null,
  rotation: 0,
  type: NodeType.frame,
  width: 10,
  x: 0,
  y: 0,
  ...overrides,
});

describe('getSelectionBounds', () => {
  it('should return the bounds of a single node', () => {
    // result
    expect(getSelectionBounds([buildNode({ height: 20, width: 30, x: 5, y: 5 })])).toEqual({
      height: 20,
      width: 30,
      x: 5,
      y: 5,
    });
  });

  it('should return the combined bounds of several non-overlapping nodes', () => {
    // mock
    const a = buildNode({ height: 10, width: 10, x: 0, y: 0 });
    const b = buildNode({ height: 10, width: 10, x: 40, y: 40 });

    // result
    expect(getSelectionBounds([a, b])).toEqual({ height: 50, width: 50, x: 0, y: 0 });
  });

  it('should return the combined bounds regardless of node order', () => {
    // mock
    const a = buildNode({ height: 10, width: 10, x: 40, y: 40 });
    const b = buildNode({ height: 10, width: 10, x: 0, y: 0 });

    // result
    expect(getSelectionBounds([a, b])).toEqual({ height: 50, width: 50, x: 0, y: 0 });
  });
});
