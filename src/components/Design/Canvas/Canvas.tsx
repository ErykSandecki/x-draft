import { FC, useRef } from 'react';

// hooks
import { useCanvasRenderLoop } from './hooks/useCanvasRenderLoop';
import { useCanvasResize } from './hooks/useCanvasResize';

// styles
import styles from './canvas.module.scss';

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCanvasResize(canvasRef);
  useCanvasRenderLoop(canvasRef);

  return (
    <div className={styles.Canvas}>
      <div className={styles.texture} />
      <canvas className={styles.canvasElement} ref={canvasRef} />
    </div>
  );
};

export default Canvas;
