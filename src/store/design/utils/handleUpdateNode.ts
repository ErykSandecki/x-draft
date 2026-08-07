// types
import { TDesignState } from '../types';
import { TSceneNode } from 'types/design/types';

export const handleUpdateNode = (state: TDesignState, payload: { changes: Partial<TSceneNode>; id: string }): void => {
  const node = state.nodes[payload.id];

  if (node) {
    Object.assign(node, payload.changes);
  }
};
