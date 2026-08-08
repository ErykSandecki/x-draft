import { FC, useRef } from 'react';

// hooks
import { useCanvasDragPan } from './hooks/useCanvasDragPan/useCanvasDragPan';
import { useCanvasPanZoom } from './hooks/useCanvasPanZoom/useCanvasPanZoom';
import { useCanvasRenderLoop } from './hooks/useCanvasRenderLoop/useCanvasRenderLoop';
import { useCanvasResize } from './hooks/useCanvasResize/useCanvasResize';
import { useDrawShapeTool } from './hooks/useDrawShapeTool/useDrawShapeTool';
import { useHoverHighlight } from './hooks/useHoverHighlight/useHoverHighlight';
import { useSelectionTool } from './hooks/useSelectionTool/useSelectionTool';

// others
import { FRAME_FILL, RECTANGLE_FILL } from './constants';

// styles
import styles from './canvas.module.scss';

// types
import { NodeType, ToolName } from 'types/design/enums';
import { TDraftRect } from 'types/canvas';

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draftRef = useRef<TDraftRect | null>(null);
  const marqueeRef = useRef<TDraftRect | null>(null);
  const hoverRef = useRef<string | null>(null);

  useCanvasResize(canvasRef);
  useCanvasPanZoom(canvasRef);
  useCanvasDragPan(canvasRef);
  useDrawShapeTool(canvasRef, draftRef, { fill: FRAME_FILL, name: 'Frame', tool: ToolName.frame, type: NodeType.frame });
  useDrawShapeTool(canvasRef, draftRef, { fill: RECTANGLE_FILL, name: 'Rectangle', tool: ToolName.rectangle, type: NodeType.rectangle });
  useSelectionTool(canvasRef, marqueeRef);
  useHoverHighlight(canvasRef, hoverRef);
  useCanvasRenderLoop(canvasRef, draftRef, marqueeRef, hoverRef);

  return (
    <div className={styles.Canvas}>
      <div className={styles.Canvas__texture} />
      <canvas className={styles['Canvas__canvas-element']} ref={canvasRef} />
    </div>
  );
};

export default Canvas;
