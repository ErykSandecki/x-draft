import { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import { Icon } from 'shared';

// others
import { colors } from 'constant/colors';

// styles
import styles from './HomePage.module.scss';

const HomePage: FC = () => {
  const { t } = useTranslation();

  return (
    <main className={styles.HomePage}>
      <Icon color="blue1" name="Logo" size={32} />
      <h1>x-draft</h1>
      <p style={{ color: colors.neutral2 }}>{t('home.subtitle')}</p>
      <p style={{ color: colors.neutral2 }}>{t('home.description')}</p>
    </main>
  );
};

export default HomePage;
