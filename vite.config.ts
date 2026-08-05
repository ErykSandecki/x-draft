/// <reference types="vitest/config" />

import path from 'node:path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        ref: true,
        titleProp: true,
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    resolveSnapshotPath: (testPath, snapExtension) =>
      path.join(path.dirname(testPath), 'snapshots', `${path.basename(testPath)}${snapExtension}`),
    setupFiles: ['./src/test/setup.ts'],
  },
});
