import { FC } from 'react';

// core
import { Routing } from 'core';

// hooks
import { useTheme } from 'hooks';

// styles
import styles from './App.module.scss';

const App: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.App}>
      <button type="button" className={styles.ThemeToggle} onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} theme
      </button>
      <Routing />
    </div>
  );
};

export default App;
