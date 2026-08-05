import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';

// components
import App from 'components/App/App';

// others
import { initI18n } from 'translations';

// store
import { store } from 'store';

// styles
import 'styles/index.scss';

const container = document.getElementById('root')!;

initI18n().then(() => {
  createRoot(container).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
});
