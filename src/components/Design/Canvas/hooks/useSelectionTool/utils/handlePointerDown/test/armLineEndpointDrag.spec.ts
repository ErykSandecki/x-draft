// utils
import { armLineEndpointDrag } from '../armLineEndpointDrag';

const createCanvasMock = (): HTMLCanvasElement => ({ setPointerCapture: vi.fn() }) as unknown as HTMLCanvasElement;

describe('armLineEndpointDrag', () => {
  it('should arm the endpoint drag for the given node and endpoint and capture the pointer', () => {
    // mock
    const canvas = createCanvasMock();
    const event = { pointerId: 3 } as PointerEvent;
    const armEndpointDrag = vi.fn();

    // before
    armLineEndpointDrag(canvas, event, armEndpointDrag, 'line-1', 'a');

    // result
    expect(armEndpointDrag).toHaveBeenCalledWith('line-1', 'a');
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(3);
  });
});
