import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API не отдаёт CORS-заголовки для чужих доменов, поэтому в dev ходим через прокси.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/hsprice': {
        target: 'https://api.favorit-parts.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hsprice/, '/hs/hsprice/'),
      },
    },
  },
});
