import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      host: true,
      port: 5173,
      hmr: isHmrDisabled ? false : {
        protocol: 'wss',
        clientPort: 443,
      },
      watch: isHmrDisabled ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});