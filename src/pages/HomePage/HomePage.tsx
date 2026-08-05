import { FC } from 'react';

// components
import { Icon } from 'shared';

// others
import { colors } from 'constant/colors';

// styles
import styles from './HomePage.module.scss';

const HomePage: FC = () => (
  <main className={styles.HomePage}>
    <Icon color="blue1" name="Logo" size={32} />
    <h1>x-draft</h1>
    <p style={{ color: colors.neutral2 }}>Vite + React + TypeScript</p>
  </main>
);

export default HomePage;
