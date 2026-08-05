import { FC } from 'react';

// components
import { Icon } from 'shared';

// hooks
import { useTheme } from 'hooks';

// others
import { colors } from 'constant/colors';

// styles
import styles from './App.module.scss';

const App: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className={styles.App}>
      <Icon color="blue1" name="Logo" size={32} />
      <h1>x-draft</h1>
      <p style={{ color: colors.neutral2 }}>Vite + React + TypeScript</p>
      <button type="button" className={styles.ThemeToggle} onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} theme
      </button>
    </main>
  );
};

export default App;
