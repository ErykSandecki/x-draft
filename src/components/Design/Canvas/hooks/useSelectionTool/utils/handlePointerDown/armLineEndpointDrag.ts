// types
import { TArmEndpointDrag, TLineEndpoint } from '../../types';

export const armLineEndpointDrag = (
  canvas: HTMLCanvasElement,
  event: PointerEvent,
  armEndpointDrag: TArmEndpointDrag,
  nodeId: string,
  endpoint: TLineEndpoint,
): void => {
  armEndpointDrag(nodeId, endpoint);
  canvas.setPointerCapture(event.pointerId);
};
