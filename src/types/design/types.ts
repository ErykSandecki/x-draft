// types
import { NodeType } from './enums';
import { TDraftRect } from 'types/canvas';

export type TDraftShape = TDraftRect & {
  fill: string;
  type: NodeType.ellipse | NodeType.frame | NodeType.rectangle;
};

export type TDraftPolygon = TDraftRect & {
  fill: string;
  sides: number;
  type: NodeType.polygon;
};

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

export type TPolygonNode = TBaseNode & {
  fill: string;
  sides: number;
  type: NodeType.polygon;
};

export type TRectangleNode = TBaseNode & {
  fill: string;
  type: NodeType.rectangle;
};

export type TLineNode = {
  id: string;
  name: string;
  parentId: string | null;
  stroke: string;
  type: NodeType.line;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export type TDraftLine = Omit<TLineNode, 'id' | 'name' | 'parentId'>;

export type TDraftEntity = TDraftShape | TDraftLine | TDraftPolygon;

export type TBoxSceneNode = TEllipseNode | TFrameNode | TPolygonNode | TRectangleNode;

export type TSceneNode = TBoxSceneNode | TLineNode;

export type TNewSceneNode =
  | Omit<TEllipseNode, 'id'>
  | Omit<TFrameNode, 'id'>
  | Omit<TPolygonNode, 'id'>
  | Omit<TRectangleNode, 'id'>
  | Omit<TLineNode, 'id'>;

export type TSceneNodeChanges =
  | Partial<TEllipseNode>
  | Partial<TFrameNode>
  | Partial<TPolygonNode>
  | Partial<TRectangleNode>
  | Partial<TLineNode>;

export type TViewport = {
  x: number;
  y: number;
  zoom: number;
};
