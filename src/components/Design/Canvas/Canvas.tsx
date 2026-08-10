import { FC, useRef } from 'react';

// hooks
import { useCanvasDragPan } from './hooks/useCanvasDragPan/useCanvasDragPan';
import { useCanvasPanZoom } from './hooks/useCanvasPanZoom/useCanvasPanZoom';
import { useCanvasRenderLoop } from './hooks/useCanvasRenderLoop/useCanvasRenderLoop';
import { useCanvasResize } from './hooks/useCanvasResize/useCanvasResize';
import { useDrawLineTool } from './hooks/useDrawLineTool/useDrawLineTool';
import { useDrawPolygonTool } from './hooks/useDrawPolygonTool/useDrawPolygonTool';
import { useDrawShapeTool } from './hooks/useDrawShapeTool/useDrawShapeTool';
import { useHoverHighlight } from './hooks/useHoverHighlight/useHoverHighlight';
import { useSelectionTool } from './hooks/useSelectionTool/useSelectionTool';

// others
import {
  ELLIPSE_TOOL_SETTINGS,
  FRAME_TOOL_SETTINGS,
  LINE_TOOL_SETTINGS,
  POLYGON_TOOL_SETTINGS,
  RECTANGLE_TOOL_SETTINGS,
} from './toolSettings';

// styles
import styles from './canvas.module.scss';

// types
import { TDraftRect } from 'types/canvas';
import { TDraftEntity } from 'types/design/types';

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draftRef = useRef<TDraftEntity | null>(null);
  const marqueeRef = useRef<TDraftRect | null>(null);
  const hoverRef = useRef<string | null>(null);

  useCanvasResize(canvasRef);
  useCanvasPanZoom(canvasRef);
  useCanvasDragPan(canvasRef);
  useDrawShapeTool(canvasRef, draftRef, FRAME_TOOL_SETTINGS);
  useDrawShapeTool(canvasRef, draftRef, RECTANGLE_TOOL_SETTINGS);
  useDrawShapeTool(canvasRef, draftRef, ELLIPSE_TOOL_SETTINGS);
  useDrawPolygonTool(canvasRef, draftRef, POLYGON_TOOL_SETTINGS);
  useDrawLineTool(canvasRef, draftRef, LINE_TOOL_SETTINGS);
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
