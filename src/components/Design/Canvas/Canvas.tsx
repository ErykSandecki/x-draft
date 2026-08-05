import { FC, useRef } from 'react';

// hooks
import { useCanvasResize } from './hooks/useCanvasResize';

// styles
import styles from './canvas.module.scss';

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCanvasResize(canvasRef);

  return <canvas className={styles.Canvas} ref={canvasRef} />;
};

export default Canvas;
