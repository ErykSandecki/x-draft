import { FC } from 'react';

// styles
import styles from './NotFoundPage.module.scss';

const NotFoundPage: FC = () => (
  <main className={styles.NotFoundPage}>
    <h1>404</h1>
    <p>Page not found.</p>
  </main>
);

export default NotFoundPage;
