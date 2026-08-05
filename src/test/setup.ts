import '@testing-library/jest-dom/vitest';

// others
import { DEFAULT_LANGUAGE, initI18n } from 'translations';

// force English regardless of the machine/CI locale, so snapshots stay deterministic
await initI18n(DEFAULT_LANGUAGE);

// jsdom doesn't implement matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    addEventListener: (): void => {},
    addListener: (): void => {},
    dispatchEvent: (): boolean => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: (): void => {},
    removeListener: (): void => {},
  }),
  writable: true,
});
