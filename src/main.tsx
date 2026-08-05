import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// components
import App from 'components/App/App';

// others
import { initI18n } from 'translations';

// styles
import 'styles/index.scss';

const container = document.getElementById('root')!;

initI18n().then(() => {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
