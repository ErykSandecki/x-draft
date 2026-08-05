import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// components
import App from 'components/App/App';

// styles
import 'styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
