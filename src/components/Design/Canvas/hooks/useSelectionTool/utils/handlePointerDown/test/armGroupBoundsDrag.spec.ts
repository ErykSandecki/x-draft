// utils
import { armGroupBoundsDrag } from '../armGroupBoundsDrag';

const createCanvasMock = (): HTMLCanvasElement => ({ setPointerCapture: vi.fn() }) as unknown as HTMLCanvasElement;

describe('armGroupBoundsDrag', () => {
  it('should arm a deselect drag for the current selection and capture the pointer', () => {
    // mock
    const canvas = createCanvasMock();
    const event = { pointerId: 3 } as PointerEvent;
    const armDrag = vi.fn();

    // before
    armGroupBoundsDrag(canvas, event, armDrag, ['a', 'b'], { x: 10, y: 10 });

    // result
    expect(armDrag).toHaveBeenCalledWith(['a', 'b'], { kind: 'deselect' }, { x: 10, y: 10 });
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(3);
  });
});
