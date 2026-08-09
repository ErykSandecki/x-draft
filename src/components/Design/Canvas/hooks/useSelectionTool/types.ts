// types
import { TPoint } from 'types/canvas';

export type TPendingClickAction = { id: string; kind: 'collapse' } | { kind: 'deselect' };

export type TArmDrag = (armIds: string[], pendingClickAction: TPendingClickAction | null, point: TPoint) => void;

export type TLineEndpoint = 'a' | 'b';

export type TArmEndpointDrag = (nodeId: string, endpoint: TLineEndpoint) => void;
