import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL || 'http://localhost:7860'),
      'process.env.BACKEND_CONNECT_PATH': JSON.stringify(env.BACKEND_CONNECT_PATH || '/connect'),
      'process.env.WEB_SOCKET_URL': JSON.stringify(env.WEB_SOCKET_URL || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/connect': {
          target: env.BACKEND_URL || 'http://0.0.0.0:7860',
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
