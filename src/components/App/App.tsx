import { FC } from 'react';
import { useTranslation } from 'react-i18next';

// core
import { Routing } from 'core';

// hooks
import { useTheme } from 'hooks';

// styles
import styles from './App.module.scss';

const App: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={styles.App}>
      <button type="button" className={styles.ThemeToggle} onClick={toggleTheme}>
        {theme === 'dark' ? t('app.themeToggle.switchToLight') : t('app.themeToggle.switchToDark')}
      </button>
      <Routing />
    </div>
  );
};

export default App;
