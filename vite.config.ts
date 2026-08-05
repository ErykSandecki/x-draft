/// <reference types="vitest/config" />
import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // snapshots live in a sibling `snapshots/` folder, mirroring x-design
    resolveSnapshotPath: (testPath, snapExtension) =>
      path.join(path.dirname(testPath), 'snapshots', `${path.basename(testPath)}${snapExtension}`),
  },
});
