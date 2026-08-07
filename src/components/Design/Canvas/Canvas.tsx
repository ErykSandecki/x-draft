import { FC, useRef } from 'react';

// hooks
import { useCanvasPanZoom } from './hooks/useCanvasPanZoom/useCanvasPanZoom';
import { useCanvasRenderLoop } from './hooks/useCanvasRenderLoop/useCanvasRenderLoop';
import { useCanvasResize } from './hooks/useCanvasResize/useCanvasResize';
import { useFrameTool } from './hooks/useFrameTool/useFrameTool';

// styles
import styles from './canvas.module.scss';

// types
import { TDraftRect } from './types';

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draftRef = useRef<TDraftRect | null>(null);

  useCanvasResize(canvasRef);
  useCanvasPanZoom(canvasRef);
  useFrameTool(canvasRef, draftRef);
  useCanvasRenderLoop(canvasRef, draftRef);

  return (
    <div className={styles.Canvas}>
      <div className={styles.Canvas__texture} />
      <canvas className={styles['Canvas__canvas-element']} ref={canvasRef} />
    </div>
  );
};

export default Canvas;
