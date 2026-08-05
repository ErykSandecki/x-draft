import { FC } from 'react';

// core
import { Routing } from 'core';

// styles
import styles from './App.module.scss';

const App: FC = () => (
  <div className={styles.App}>
    <Routing />
  </div>
);

export default App;
