import { defineConfig } from 'vite';

export default defineConfig({
  // Base relativa './' para que funcione tanto en subdominios raíz como en subdirectorios de GitHub Pages
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
});
