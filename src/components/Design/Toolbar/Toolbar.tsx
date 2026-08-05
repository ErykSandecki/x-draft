import { FC } from 'react';

// components
import MouseModes from './MouseModes/MouseModes';

// styles
import styles from './toolbar.module.scss';

const Toolbar: FC = () => (
  <div className={styles.Toolbar} onMouseDown={(event) => event.stopPropagation()}>
    <MouseModes />
  </div>
);

export default Toolbar;
