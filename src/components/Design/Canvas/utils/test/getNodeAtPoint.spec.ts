// types
import { NodeType } from 'types/design/enums';
import { TSceneNode } from 'types/design/types';

// utils
import { getNodeAtPoint } from '../getNodeAtPoint';

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

describe('getNodeAtPoint', () => {
  it('should return the node the point falls inside', () => {
    // mock
    const node = buildNode({ id: 'a' });

    // result
    expect(getNodeAtPoint({ x: 5, y: 5 }, [node])).toEqual(node);
  });

  it('should return null when the point misses every node', () => {
    // mock
    const node = buildNode({ id: 'a' });

    // result
    expect(getNodeAtPoint({ x: 50, y: 50 }, [node])).toBeNull();
  });

  it('should return the topmost (last-drawn) node when nodes overlap', () => {
    // mock
    const bottom = buildNode({ id: 'bottom' });
    const top = buildNode({ id: 'top' });

    // result
    expect(getNodeAtPoint({ x: 5, y: 5 }, [bottom, top])?.id).toBe('top');
  });

  it('should treat the edges of a node as inside', () => {
    // mock
    const node = buildNode({ height: 10, id: 'a', width: 10, x: 0, y: 0 });

    // result
    expect(getNodeAtPoint({ x: 10, y: 10 }, [node])).toEqual(node);
  });

  it('should return null for an empty scene', () => {
    // result
    expect(getNodeAtPoint({ x: 0, y: 0 }, [])).toBeNull();
  });

  it('should use elliptical hit-testing for ellipse nodes, not the bounding box', () => {
    // mock
    const node = buildNode({ height: 10, type: NodeType.ellipse, width: 20, x: 0, y: 0 });

    // result — the bounding box's (0, 0) corner sits outside the inscribed ellipse
    expect(getNodeAtPoint({ x: 0, y: 0 }, [node])).toBeNull();
    expect(getNodeAtPoint({ x: 10, y: 5 }, [node])).toEqual(node);
  });
});
