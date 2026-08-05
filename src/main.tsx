import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// components
import App from 'components/App/App';

// styles
import 'styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
