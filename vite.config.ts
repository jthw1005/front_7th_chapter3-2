import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

const base: string =
  process.env.NODE_ENV === 'production' ? '/front_7th_chapter3-2/' : '';

export default mergeConfig(
  defineConfig({
    base,
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          origin: resolve(__dirname, 'index.origin.html'),
          basic: resolve(__dirname, 'index.basic.html'),
          advanced: resolve(__dirname, 'index.advanced.html'),
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  })
);
