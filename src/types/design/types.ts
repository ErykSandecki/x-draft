// types
import { NodeType } from './enums';

export type TBaseNode = {
  height: number;
  id: string;
  name: string;
  parentId: string | null;
  rotation: number;
  width: number;
  x: number;
  y: number;
};

export type TEllipseNode = TBaseNode & {
  fill: string;
  type: NodeType.ellipse;
};

export type TFrameNode = TBaseNode & {
  fill: string;
  type: NodeType.frame;
};

export type TRectangleNode = TBaseNode & {
  fill: string;
  type: NodeType.rectangle;
};

export type TSceneNode = TEllipseNode | TFrameNode | TRectangleNode;

export type TViewport = {
  x: number;
  y: number;
  zoom: number;
};
